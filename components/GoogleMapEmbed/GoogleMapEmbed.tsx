import React from "react"


const GoogleMapEmbed: React.FC = () => {
  return (
    <section className="flex justify-center h-[500px] container mx-auto my-28">
      <iframe
        src="https://www.google.com/maps?q=gym&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  )
}

export default GoogleMapEmbed;