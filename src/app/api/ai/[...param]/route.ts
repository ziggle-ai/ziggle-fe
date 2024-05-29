import { NextResponse } from 'next/server';

const router = async (
  request: Request,
  context: {
    params: { param: string[] };
  },
) => {
  const base = process.env.AI_PUBLIC_API_BASE_URL;
  const path = context.params.param.join('/');
  const res = await fetch(`${base}${path}`, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(await request.json()),
  });

  return NextResponse.json(await res.json(), res);
};

export {
  router as DELETE,
  router as GET,
  router as PATCH,
  router as POST,
  router as PUT,
};
