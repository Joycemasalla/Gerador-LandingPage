import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callGemini } from './aiService';

describe('callGemini', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');
    vi.stubEnv('VITE_GEMINI_API_KEY_P1', '');
    vi.stubEnv('VITE_GEMINI_API_KEY_P2', '');
    
    global.fetch = vi.fn();
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const createMockResponse = (status, ok, data, statusText = '') => {
    return {
      ok,
      status,
      statusText,
      json: async () => data,
      text: async () => typeof data === 'string' ? data : JSON.stringify(data)
    };
  };

  it('✓ HTTP 200 - deve retornar texto em sucesso', async () => {
    global.fetch.mockResolvedValue(
      createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "Sucesso!" }] } }] })
    );
    const promise = callGemini(null, "Teste");
    await vi.runAllTimersAsync();
    expect(await promise).toBe("Sucesso!");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('✓ HTTP 200 - jsonMode', async () => {
    global.fetch.mockResolvedValue(
      createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: '{"ok": true}' }] } }] })
    );
    const promise = callGemini(null, "Teste", { jsonMode: true });
    await vi.runAllTimersAsync();
    expect(await promise).toEqual({ ok: true });
  });

  it('✓ 400 - Client Error não deve sofrer retry', async () => {
    global.fetch.mockResolvedValue(createMockResponse(400, false, "Bad Request"));
    await expect(callGemini(null, "Teste")).rejects.toThrow(/Gemini Client Error: 400/);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('✓ 401 - Unauthorized não deve sofrer retry', async () => {
    global.fetch.mockResolvedValue(createMockResponse(401, false, "Unauthorized"));
    await expect(callGemini(null, "Teste")).rejects.toThrow(/401/);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('✓ 403 - Forbidden não deve sofrer retry', async () => {
    global.fetch.mockResolvedValue(createMockResponse(403, false, "Forbidden"));
    await expect(callGemini(null, "Teste")).rejects.toThrow(/403/);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('✓ 404 - Not Found não deve sofrer retry', async () => {
    global.fetch.mockResolvedValue(createMockResponse(404, false, "Not Found"));
    await expect(callGemini(null, "Teste")).rejects.toThrow(/404/);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('✓ 408 - Request Timeout deve sofrer retry no mesmo modelo', async () => {
    global.fetch
      .mockResolvedValueOnce(createMockResponse(408, false, "Request Timeout"))
      .mockResolvedValue(createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "OK" }] } }] }));
    const promise = callGemini(null, "Teste");
    await vi.runAllTimersAsync();
    expect(await promise).toBe("OK");
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch.mock.calls[0][0]).toEqual(global.fetch.mock.calls[1][0]);
  });

  it('✓ 500 - Internal Server Error deve sofrer retry no mesmo modelo', async () => {
    global.fetch
      .mockResolvedValueOnce(createMockResponse(500, false, "Internal Server Error"))
      .mockResolvedValue(createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "OK" }] } }] }));
    const promise = callGemini(null, "Teste");
    await vi.runAllTimersAsync();
    expect(await promise).toBe("OK");
    expect(global.fetch.mock.calls[0][0]).toEqual(global.fetch.mock.calls[1][0]);
  });
  
  it('✓ 502 - Bad Gateway deve ativar fallback e dar retry', async () => {
    global.fetch
      .mockResolvedValueOnce(createMockResponse(502, false, "Bad Gateway"))
      .mockResolvedValue(createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "OK" }] } }] }));
    const promise = callGemini(null, "Teste");
    await vi.runAllTimersAsync();
    expect(await promise).toBe("OK");
    expect(global.fetch.mock.calls[0][0]).not.toEqual(global.fetch.mock.calls[1][0]); 
  });

  it('✓ 503 - Service Unavailable deve ativar fallback e dar retry', async () => {
    global.fetch
      .mockResolvedValueOnce(createMockResponse(503, false, "Service Unavailable"))
      .mockResolvedValue(createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "OK" }] } }] }));
    const promise = callGemini(null, "Teste");
    await vi.runAllTimersAsync();
    expect(await promise).toBe("OK");
    expect(global.fetch.mock.calls[0][0]).not.toEqual(global.fetch.mock.calls[1][0]); 
  });

  it('✓ 504 - Gateway Timeout deve sofrer retry no mesmo modelo', async () => {
    global.fetch
      .mockResolvedValueOnce(createMockResponse(504, false, "Gateway Timeout"))
      .mockResolvedValue(createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "OK" }] } }] }));
    const promise = callGemini(null, "Teste");
    await vi.runAllTimersAsync();
    expect(await promise).toBe("OK");
    expect(global.fetch.mock.calls[0][0]).toEqual(global.fetch.mock.calls[1][0]);
  });
  
  it('✓ 429 - Too Many Requests deve ativar fallback e dar retry', async () => {
    global.fetch
      .mockResolvedValueOnce(createMockResponse(429, false, "Too Many Requests"))
      .mockResolvedValue(createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "OK" }] } }] }));
    const promise = callGemini(null, "Teste");
    await vi.runAllTimersAsync();
    expect(await promise).toBe("OK");
    expect(global.fetch.mock.calls[0][0]).not.toEqual(global.fetch.mock.calls[1][0]);
  });

  it('✓ Timeout de conexão', async () => {
    global.fetch.mockImplementation((url, options) => new Promise((_, reject) => {
      if (options.signal) {
        options.signal.addEventListener('abort', () => reject(new DOMException("Timeout de conexão excedido.", "AbortError")));
      }
    }));
    const promise = callGemini(null, "Teste", { timeoutMs: 1000 });
    const assertion = expect(promise).rejects.toThrow(/Timeout/);
    for(let i=0; i<5; i++) {
        await vi.runAllTimersAsync();
    }
    await assertion;
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('✓ AbortController cancela imediatamente', async () => {
    global.fetch.mockImplementation((url, options) => new Promise((_, reject) => {
      if (options.signal) {
        options.signal.addEventListener('abort', () => reject(new DOMException("Aborted", "AbortError")));
      }
    }));
    const controller = new AbortController();
    const promise = callGemini(null, "Teste", { signal: controller.signal });
    const assertion = expect(promise).rejects.toThrow(/Usuario cancelou|Aborted/);
    
    controller.abort(new Error("Usuario cancelou"));
    await assertion;
  });

  it('✓ Cancelamento durante retry', async () => {
    global.fetch.mockResolvedValueOnce(createMockResponse(500, false, "Erro temporario"));
    global.fetch.mockImplementationOnce((url, options) => new Promise((_, reject) => {
      if (options.signal) {
        options.signal.addEventListener('abort', () => reject(new DOMException("Aborted", "AbortError")));
      }
    }));

    const controller = new AbortController();
    const promise = callGemini(null, "Teste", { signal: controller.signal });
    const assertion = expect(promise).rejects.toThrow(/Cancel|Aborted/);
    
    await vi.advanceTimersByTimeAsync(1);
    
    controller.abort(new Error("Cancel"));
    await vi.runAllTimersAsync();

    await assertion;
  });

  it('✓ JSON inválido gera erro e aborta retry', async () => {
    global.fetch.mockResolvedValue(
      createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "Eu não sou JSON" }] } }] })
    );
    await expect(callGemini(null, "Teste", { jsonMode: true })).rejects.toThrow(/A IA não retornou um JSON válido/);
    expect(global.fetch).toHaveBeenCalledTimes(1); 
  });

  it('✓ JSON truncado, resposta parcial (parse salva via parseJsonFromAI)', async () => {
    const dirtyJson = '```json\n{"ok":true}\n```';
    global.fetch.mockResolvedValue(
      createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: dirtyJson }] } }] })
    );
    const promise = callGemini(null, "Teste", { jsonMode: true });
    await vi.runAllTimersAsync();
    expect(await promise).toEqual({ ok: true });
  });

  it('✓ Ambos indisponíveis esgota tentativas', async () => {
    global.fetch.mockResolvedValue(createMockResponse(503, false, "Unavailable"));
    const promise = callGemini(null, "Teste");
    const assertion = expect(promise).rejects.toThrow(/503/);
    for(let i=0; i<5; i++) await vi.runAllTimersAsync();
    await assertion;
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('✓ API Key inválida via props', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    await expect(callGemini(null, "Teste")).rejects.toThrow(/VITE_GEMINI_API_KEY não configurada/);
  });

  it('✓ Resposta sem candidates', async () => {
    global.fetch.mockResolvedValue(createMockResponse(200, true, { }));
    const promise = callGemini(null, "Teste");
    const assertion = expect(promise).rejects.toThrow(/resposta vazia/);
    for(let i=0; i<5; i++) await vi.runAllTimersAsync();
    await assertion;
  });
  
  it('✓ candidates vazio', async () => {
    global.fetch.mockResolvedValue(createMockResponse(200, true, { candidates: [] }));
    const promise = callGemini(null, "Teste");
    const assertion = expect(promise).rejects.toThrow(/resposta vazia/);
    for(let i=0; i<5; i++) await vi.runAllTimersAsync();
    await assertion;
  });

  it('✓ parts vazio', async () => {
    global.fetch.mockResolvedValue(
      createMockResponse(200, true, { candidates: [{ content: { parts: [] } }] })
    );
    const promise = callGemini(null, "Teste");
    await vi.runAllTimersAsync();
    expect(await promise).toBe("");
  });

  it('✓ Múltiplas chamadas simultâneas', async () => {
    global.fetch.mockResolvedValue(
      createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "OK" }] } }] })
    );
    const promise1 = callGemini(null, "Call 1");
    const promise2 = callGemini(null, "Call 2");
    await vi.runAllTimersAsync();
    const [res1, res2] = await Promise.all([promise1, promise2]);
    expect(res1).toBe("OK");
    expect(res2).toBe("OK");
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
  
  it('✓ Exponential Backoff e Jitter (Delays variados)', async () => {
    global.fetch
      .mockResolvedValueOnce(createMockResponse(500, false, "Err 1"))
      .mockResolvedValueOnce(createMockResponse(500, false, "Err 2"))
      .mockResolvedValue(createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "OK" }] } }] }));
      
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    const promise = callGemini(null, "Teste");
    for(let i=0; i<5; i++) await vi.runAllTimersAsync();
    
    expect(await promise).toBe("OK");
    
    const delayCalls = setTimeoutSpy.mock.calls
        .map(c => c[1])
        .filter(delay => delay >= 1000 && delay < 3000); 
    
    expect(delayCalls.length).toBe(2);
    expect(delayCalls[0]).toBeGreaterThanOrEqual(1000);
    expect(delayCalls[1]).toBeGreaterThanOrEqual(2000);
  });
  
  it('✓ Retry 429 no fallback aplica cooldown longo', async () => {
    global.fetch
      .mockResolvedValueOnce(createMockResponse(503, false, "Service Unavailable"))
      .mockResolvedValueOnce(createMockResponse(429, false, "Too Many Requests"))
      .mockResolvedValue(createMockResponse(200, true, { candidates: [{ content: { parts: [{ text: "OK" }] } }] }));
      
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    const promise = callGemini(null, "Teste");
    for(let i=0; i<5; i++) await vi.runAllTimersAsync();
    
    expect(await promise).toBe("OK");
    
    const penaltyDelay = setTimeoutSpy.mock.calls
        .map(c => c[1])
        .find(delay => delay >= 60000 && delay < 61000);
        
    expect(penaltyDelay).toBeDefined();
  });
});
