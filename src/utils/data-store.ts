//@ts-ignore
import { Storage } from "@stacks/storage"
import { UserSession } from "@stacks/auth"
import { KEYPAIR_FILE } from "./constants"

export const saveKeyPair = async (
  userSession: UserSession,
  keyPair: string,
  isPublic: boolean
) => {
  const data = {
    keyPair,
    isPublic,
  } as any

  const storage = new Storage({ userSession })
  await storage.putFile(KEYPAIR_FILE, JSON.stringify(data), {
    encrypt: !isPublic,
    //@ts-ignore
    dangerouslyIgnoreEtag: true,
  })
}

export const fetchKeyPair = async (
  userSession: UserSession,
  username?: string
): Promise<string> => {
  try {
    const storage = new Storage({ userSession })
    const keyPairJSON = await storage.getFile(KEYPAIR_FILE, {
      decrypt: false,
      username: username || undefined,
    }) as string
    if (keyPairJSON) {
      const json = JSON.parse(keyPairJSON)
      if (json.isPublic) {
        return json as string
      } else {
        const decrypt = JSON.parse(
          (await userSession.decryptContent(keyPairJSON)) as string
        )
        localStorage.setItem(KEYPAIR_FILE, JSON.stringify(decrypt))
        return decrypt as string
      }
    } else {
      return ""
    }
  } catch (e) {
    console.error(e)
    return ""
  }
}
