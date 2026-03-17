import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export function UserProfile() {

  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        setEmail(data.user.email ?? "")
      }
    }

    getUser()
  }, [])

  const cambiarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setAvatar(url)
  }

  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>

      <img
        src={avatar || "https://via.placeholder.com/40"}
        style={{
          width:"40px",
          height:"40px",
          borderRadius:"50%",
          objectFit:"cover"
        }}
      />

      <div>
        <div>Bienvenido 👋</div>
        <div style={{ fontSize:"12px", color:"gray" }}>
          {email}
        </div>
      </div>

      <input type="file" onChange={cambiarFoto} />

    </div>
  )
}
