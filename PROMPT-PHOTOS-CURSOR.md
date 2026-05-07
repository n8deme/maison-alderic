# PROMPT CURSOR — Intégration photos avocats Maison Aldéric

**CONTEXTE** : Le fichier `lib/avocats-photos.ts` contient les URLs Unsplash de 8 avocats (portraits pros 800x800). Il faut maintenant les afficher partout dans le site vitrine ET le portail client.

---

## FICHIERS À MODIFIER (dans cet ordre)

### 1. Page /associes (grid 8 avocats)

**Fichier** : `app/associes/page.tsx`

**Action** :
- Importer `import { getAvocatPhoto } from '@/lib/avocats-photos'`
- Pour chaque avocat dans la grid, remplacer le placeholder rond gris par :
  ```tsx
  <Image
    src={getAvocatPhoto(avocat.slug)}
    alt={avocat.nom}
    width={200}
    height={200}
    className="rounded-full object-cover"
  />
  ```
- Importer `Image` depuis `next/image`

---

### 2. Page /associes/[slug] (hero photo grande)

**Fichier** : `app/associes/[slug]/page.tsx`

**Action** :
- Importer `import { getAvocatPhoto } from '@/lib/avocats-photos'`
- Dans la hero section, remplacer le placeholder par :
  ```tsx
  <Image
    src={getAvocatPhoto(params.slug)}
    alt={avocat.nom}
    width={600}
    height={600}
    className="rounded-lg object-cover"
  />
  ```

---

### 3. Portail — Page Rendez-vous (avatar avocat dans carte)

**Fichier** : `app/portail/rendez-vous/page.tsx`

**Action** :
- Importer `import { getAvocatPhoto } from '@/lib/avocats-photos'`
- Fetch l'avocat depuis Supabase (JOIN avec table `avocats`)
- Dans la carte RDV, remplacer les initiales par :
  ```tsx
  <Image
    src={getAvocatPhoto(avocat.slug)}
    alt={avocat.nom}
    width={48}
    height={48}
    className="rounded-full object-cover"
  />
  ```

---

### 4. Portail — Messages (avatar avocat dans thread)

**Fichier** : Component qui affiche les messages (probablement `components/portail/message-thread.tsx` ou `app/portail/messages/page.tsx`)

**Action** :
- Importer `import { getAvocatPhoto } from '@/lib/avocats-photos'`
- Fetch l'avocat depuis Supabase (JOIN avec `profiles` ou `avocats`)
- Pour chaque message d'avocat, remplacer les initiales par :
  ```tsx
  <Image
    src={getAvocatPhoto(avocat.slug)}
    alt={avocat.nom}
    width={40}
    height={40}
    className="rounded-full object-cover"
  />
  ```

---

## RÈGLES IMPORTANTES

1. **Toujours utiliser `next/image`** (jamais `<img>` direct)
2. **Toujours `object-cover`** pour les portraits (évite déformation)
3. **Toujours `rounded-full`** pour les avatars (ronds)
4. **Toujours `alt={avocat.nom}`** (accessibilité)
5. **Sizes appropriées** :
   - Grid associés : 200x200
   - Hero individuel : 600x600
   - Avatar RDV : 48x48
   - Avatar messages : 40x40

---

## QUERIES SUPABASE À AJOUTER

Si les queries existantes ne fetchent pas les infos avocat, ajoute les JOINs nécessaires :

```typescript
// Exemple pour rendez-vous
const { data: appointment } = await supabase
  .from('appointments')
  .select(`
    *,
    avocat:avocats(id, nom, prenom, slug)
  `)
  .eq('id', appointmentId)
  .single();

// Exemple pour messages
const { data: messages } = await supabase
  .from('messages')
  .select(`
    *,
    avocat:profiles!sender_id(id, nom, prenom)
  `)
  .eq('dossier_id', dossierId)
  .order('created_at', { ascending: true });
```

---

## TEST APRÈS MODIFS

1. `pnpm dev`
2. Vérifier `/associes` → 8 photos visibles
3. Vérifier `/associes/alderic-vermeulen` → grande photo hero
4. Vérifier portail `/rendez-vous` → photo avocat dans carte
5. Vérifier portail `/messages` → photo avocat dans thread

---

**GO ! Modifie tous les fichiers dans l'ordre ci-dessus.**
