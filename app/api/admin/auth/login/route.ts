import { NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to the PHP backend
    const response = await fetch(getBaseUrl('admin/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')
    
    if (isJson) {
      const data = await response.json()
      
      if (response.ok) {
        return NextResponse.json(data)
      } else {
        return NextResponse.json(
          { success: false, message: data.message || 'Login failed' },
          { status: response.status }
        )
      }
    } else {
      // Handle non-JSON responses (like HTML error pages)
      const text = await response.text()
      console.error('Non-JSON response from backend:', text.substring(0, 200))
      
      return NextResponse.json(
        { success: false, message: 'Backend returned invalid response format' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
