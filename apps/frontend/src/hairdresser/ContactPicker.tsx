import React, { useState } from 'react'

type Contact = {
  name?: string[]
  tel?: string[]
  email?: string[]
}

export const ContactPicker: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [error, setError] = useState<string | null>(null)

  const pickContacts = async () => {
    setError(null)

    if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
      try {
        const selectedContacts: Contact[] = await (navigator as any).contacts.select(
          ['name', 'tel', 'email'], // jaká pole chceš
          { multiple: true } // možnost vybrat více
        )
        setContacts(selectedContacts)
      } catch (err: unknown) {
        setError('Výběr kontaktů byl zrušen nebo selhal.')
        console.error(err)
      }
    } else {
      setError('Tento prohlížeč nepodporuje Contacts Picker API.')
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={pickContacts}>📱 Vybrat kontakty</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {contacts.length > 0 && (
        <ul>
          {contacts.map((c, i) => (
            <li key={i}>
              <strong>{c.name?.join(', ')}</strong>
              {c.tel && <div>Tel: {c.tel.join(', ')}</div>}
              {c.email && <div>Email: {c.email.join(', ')}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
