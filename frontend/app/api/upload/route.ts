import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME

    if (!cloudName || cloudName === 'your_cloud_name') {
      // Fallback for testing without Cloudinary
      return NextResponse.json({
        url: 'https://images.pexels.com/photos/209339/pexels-photo-209339.jpeg'
      })
    }

    // Use unsigned upload — no signature needed
    const uploadForm = new FormData()
    uploadForm.append('file', file)
    uploadForm.append('upload_preset', 'mycropsage_unsigned')
    uploadForm.append('folder', 'mycropsage')

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadForm }
    )

    const uploadData = await uploadRes.json()
    console.log('Cloudinary response:', uploadData.secure_url || uploadData.error)

    if (!uploadData.secure_url) {
      throw new Error(`Cloudinary: ${uploadData.error?.message || 'Upload failed'}`)
    }

    return NextResponse.json({ url: uploadData.secure_url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', detail: String(error) },
      { status: 500 }
    )
  }
}