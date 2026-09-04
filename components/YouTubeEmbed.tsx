import React from 'react'

export default function YouTubeEmbed({ id }: { id: string }) {
  const src = `https://www.youtube.com/embed/${id}`
  return (
    <div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
      <iframe src={src} title="YouTube video" style={{position: 'absolute', top:0,left:0,width:'100%',height:'100%'}} frameBorder={0} allowFullScreen />
    </div>
  )
}
