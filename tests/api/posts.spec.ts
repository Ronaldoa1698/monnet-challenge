import { test, expect } from '../../fixtures/secret.fixture';

const API = 'https://jsonplaceholder.typicode.com/posts';

function validatePostStructure(json: any, expectedPayload: any) {
  expect(json).toMatchObject(expectedPayload);
  expect(json).toHaveProperty('id');
  expect(typeof json.id).toBe('number');
  expect(json.id).toBeGreaterThan(0);
}

test.describe('@JSONPlaceholder - POST /posts', () => {
  
  test('@smoke Crear un nuevo post', async ({ request }) => {
    const payload = {
      title: 'Test Post',
      body: 'This is a test post body',
      userId: 1,
    };

    const response = await request.post(API, { data: payload });
    
    await expect(response).toBeOK();
    expect(response.status()).toBe(201);
    
    const json = await response.json();
    validatePostStructure(json, payload);
  });

  test('@regression Validar campos individuales al crear post', async ({ request }) => {
    const payload = {
      title: 'Validación de campos',
      body: 'Contenido de validación detallada',
      userId: 2,
    };

    const response = await request.post(API, { data: payload });
    await expect(response).toBeOK();
    
    const json = await response.json();
    expect(json.title).toBe(payload.title);
    expect(json.body).toBe(payload.body);
    expect(json.userId).toBe(payload.userId);
    expect(typeof json.id).toBe('number');
  });

  test('@negative Crear post con título vacío', async ({ request }) => {
    const payload = {
      title: '',
      body: 'Contenido sin título',
      userId: 1,
    };

    const response = await request.post(API, { data: payload });
    
    await expect(response).toBeOK();
    const json = await response.json();
    validatePostStructure(json, payload);
  });

  test('@negative Crear post con body vacío', async ({ request }) => {
    const payload = {
      title: 'Título sin contenido',
      body: '',
      userId: 1,
    };

    const response = await request.post(API, { data: payload });
    await expect(response).toBeOK();
    
    const json = await response.json();
    validatePostStructure(json, payload);
  });

  test('@negative Crear post sin userId', async ({ request }) => {
    const payload = {
      title: 'Post sin usuario',
      body: 'Contenido sin userId',
    };

    const response = await request.post(API, { data: payload });
    await expect(response).toBeOK();
    
    const json = await response.json();
    expect(json).toMatchObject(payload);
    expect(json).toHaveProperty('id');
  });

  test('@negative Crear post con campos adicionales', async ({ request }) => {
    const payload = {
      title: 'Post con extras',
      body: 'Contenido normal',
      userId: 1,
      extraField: 'No debería estar aquí',
      anotherExtra: 123,
    };

    const response = await request.post(API, { data: payload });
    await expect(response).toBeOK();
    
    const json = await response.json();
    expect(json).toHaveProperty('id');
    expect(json.title).toBe(payload.title);
    expect(json.body).toBe(payload.body);
    expect(json.userId).toBe(payload.userId);
  });

  test('@performance Verificar tiempo de respuesta', async ({ request }) => {
    const payload = {
      title: 'Performance Test',
      body: 'Testing response time',
      userId: 1,
    };

    const t0 = Date.now();
    const response = await request.post(API, { data: payload });
    const ms = Date.now() - t0;
    
    await expect(response).toBeOK();
    expect(ms).toBeLessThan(5000);
  });

  test('@validation Crear post con userId inválido', async ({ request }) => {
    const payload = {
      title: 'Test userId',
      body: 'Testing invalid userId',
      userId: 'invalid',
    };

    const response = await request.post(API, { data: payload });
    
    await expect(response).toBeOK();
    const json = await response.json();
    expect(json).toHaveProperty('id');
  });
});