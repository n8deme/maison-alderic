-- Mise a jour des avatars avocats (portraits Unsplash)
UPDATE avocats
SET avatar_url = CASE slug
  WHEN 'alderic-vermeulen' THEN 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&crop=faces'
  WHEN 'sophie-de-borchgrave' THEN 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces'
  WHEN 'jean-marc-petit' THEN 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces'
  WHEN 'anais-lambert' THEN 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=faces'
  WHEN 'marc-dewinter' THEN 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces'
  WHEN 'claire-vandenberg' THEN 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces'
  WHEN 'thomas-lefebvre' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces'
  WHEN 'julie-moreau' THEN 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=faces'
  ELSE avatar_url
END
WHERE slug IN (
  'alderic-vermeulen',
  'sophie-de-borchgrave',
  'jean-marc-petit',
  'anais-lambert',
  'marc-dewinter',
  'claire-vandenberg',
  'thomas-lefebvre',
  'julie-moreau'
);
