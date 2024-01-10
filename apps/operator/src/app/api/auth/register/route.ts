import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: Request) {}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {
  const bodyData = await request.json()
  const fData = await fetch(`${process.env.API_REST_URL as string}/register`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  })

  if (fData.ok) {
    return NextResponse.json(await fData.json(), { status: 200 })
  }

  if (!fData.ok) {
    return NextResponse.json(await fData.json(), { status: fData.status })
  }
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}
