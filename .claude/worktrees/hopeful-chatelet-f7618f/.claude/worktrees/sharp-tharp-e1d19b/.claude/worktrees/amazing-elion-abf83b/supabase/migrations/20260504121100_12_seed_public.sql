-- ============================================================================
-- 12 — SEED : DEALS + INSIGHTS (contenu public du site vitrine)
-- ============================================================================

-- ============================================================================
-- DEALS (8 deals notables)
-- ============================================================================
insert into public.deals (
  id, slug, title, client_name, description, amount_label,
  year, category, is_featured, display_order
) values
(
  'd0000001-3333-4333-8333-000000000001',
  'belgian-industrial-holding-techco-france',
  'Acquisition stratégique de TechCo France',
  'Belgian Industrial Holding',
  'Conseil de Belgian Industrial Holding sur l''acquisition de TechCo France, leader hexagonal de la fabrication de composants électroniques industriels. La transaction comprenait la négociation des earn-outs sur trois ans, la structuration du financement mezzanine de 80M€ et la coordination des audits de conformité environnementale dans neuf juridictions européennes. Closing en quatre mois après signing.',
  '240M€',
  2025,
  'M&A',
  true,
  1
),
(
  'd0000002-3333-4333-8333-000000000002',
  'maersk-belgium-restructuring-logistique',
  'Restructuration de l''activité logistique européenne',
  'Maersk Belgium',
  'Accompagnement de la division Belgium de Maersk dans la restructuration de son activité logistique européenne, incluant la cession de plusieurs entrepôts en Belgique et aux Pays-Bas, la renégociation des accords sociaux avec représentants du personnel et la coordination des aspects de droit social belge, néerlandais et danois.',
  null,
  2024,
  'Restructuring',
  true,
  2
),
(
  'd0000003-3333-4333-8333-000000000003',
  'pe-fund-mercator-iv-retailcorp-lbo',
  'LBO de RetailCorp par Mercator IV',
  'PE Fund Mercator IV',
  'Conseil du fonds Mercator IV sur l''acquisition à effet de levier de RetailCorp, plateforme retail multi-canal active en Belgique et au Luxembourg. Structuration du financement (senior + unitranche), négociation du shareholders'' agreement avec le management et mise en place du plan d''incitation MIP sur cinq ans.',
  '180M€',
  2025,
  'PE',
  true,
  3
),
(
  'd0000004-3333-4333-8333-000000000004',
  'famille-vandenberg-cession-industrieco',
  'Sortie family office du capital d''IndustrieCo',
  'Famille Vandenberg',
  'Conseil de la famille Vandenberg sur la cession de leur participation historique de 38% dans IndustrieCo, groupe industriel belge centenaire, à un consortium de fonds européens. Coordination des aspects fiscaux belgo-luxembourgeois et négociation des clauses de garantie de passif post-closing.',
  null,
  2024,
  'M&A',
  false,
  4
),
(
  'd0000005-3333-4333-8333-000000000005',
  'techscale-tour-table-serie-c',
  'Tour de table Série C de TechScale BV',
  'TechScale BV',
  'Conseil de TechScale BV sur son tour de table Série C mené par un fonds growth européen, avec participation de l''actionnariat existant et entrée d''un investisseur stratégique américain. Négociation du term sheet, restructuration de la cap table pré-financement et mise en place d''un nouveau ESOP de 12% post-closing.',
  '75M€',
  2025,
  'PE',
  false,
  5
),
(
  'd0000006-3333-4333-8333-000000000006',
  'gouvernement-bruxelles-arbitrage-international',
  'Arbitrage international CEPANI majeur',
  'Région de Bruxelles-Capitale',
  'Représentation de la Région de Bruxelles-Capitale dans une procédure d''arbitrage international CEPANI initiée par un consortium d''entreprises de construction. Le contentieux portait sur l''exécution d''un marché public d''infrastructure d''envergure et a abouti à une sentence largement favorable à la Région après dix-huit mois de procédure.',
  null,
  2024,
  'Restructuring',
  false,
  6
),
(
  'd0000007-3333-4333-8333-000000000007',
  'biotech-ventures-joint-venture-suisse',
  'Joint-venture transfrontalière BE-CH',
  'Biotech Ventures',
  'Conseil de Biotech Ventures, société belge spécialisée dans les biothérapies, dans la mise en place d''une joint-venture 50/50 avec un partenaire suisse pour le développement et la commercialisation conjoints d''une plateforme thérapeutique en oncologie. Structuration corporate, accords IP et coordination réglementaire avec l''AFMPS et Swissmedic.',
  null,
  2025,
  'M&A',
  false,
  7
),
(
  'd0000008-3333-4333-8333-000000000008',
  'distribution-group-reorganisation-judiciaire',
  'Réorganisation judiciaire réussie',
  'Distribution Group SA',
  'Accompagnement de Distribution Group SA dans une procédure de réorganisation judiciaire par accord collectif (PRJ) devant le tribunal de l''entreprise francophone de Bruxelles. Négociation avec les créanciers principaux, élaboration du plan de redressement opérationnel et financier, et homologation finale obtenue à plus de 85% des votes en faveur.',
  null,
  2024,
  'Restructuring',
  true,
  8
);

-- ============================================================================
-- DEAL_AVOCATS — affectation des avocats à chaque deal
-- ============================================================================
insert into public.deal_avocats (deal_id, avocat_id, role) values
-- Deal 1 : BIH × TechCo France
('d0000001-3333-4333-8333-000000000001', 'b0000001-1111-4111-8111-000000000001', 'lead'),
('d0000001-3333-4333-8333-000000000001', 'b0000005-1111-4111-8111-000000000005', 'support'),
('d0000001-3333-4333-8333-000000000001', 'b0000006-1111-4111-8111-000000000006', 'support'),
-- Deal 2 : Maersk Restructuring
('d0000002-3333-4333-8333-000000000002', 'b0000004-1111-4111-8111-000000000004', 'lead'),
('d0000002-3333-4333-8333-000000000002', 'b0000001-1111-4111-8111-000000000001', 'support'),
-- Deal 3 : Mercator IV × RetailCorp
('d0000003-3333-4333-8333-000000000003', 'b0000006-1111-4111-8111-000000000006', 'lead'),
('d0000003-3333-4333-8333-000000000003', 'b0000001-1111-4111-8111-000000000001', 'support'),
-- Deal 4 : Famille Vandenberg
('d0000004-3333-4333-8333-000000000004', 'b0000001-1111-4111-8111-000000000001', 'lead'),
('d0000004-3333-4333-8333-000000000004', 'b0000003-1111-4111-8111-000000000003', 'support'),
-- Deal 5 : TechScale Series C
('d0000005-3333-4333-8333-000000000005', 'b0000005-1111-4111-8111-000000000005', 'lead'),
('d0000005-3333-4333-8333-000000000005', 'b0000006-1111-4111-8111-000000000006', 'support'),
-- Deal 6 : Bruxelles arbitrage
('d0000006-3333-4333-8333-000000000006', 'b0000002-1111-4111-8111-000000000002', 'lead'),
('d0000006-3333-4333-8333-000000000006', 'b0000007-1111-4111-8111-000000000007', 'support'),
-- Deal 7 : Biotech JV
('d0000007-3333-4333-8333-000000000007', 'b0000001-1111-4111-8111-000000000001', 'lead'),
('d0000007-3333-4333-8333-000000000007', 'b0000003-1111-4111-8111-000000000003', 'support'),
-- Deal 8 : Distribution Group PRJ
('d0000008-3333-4333-8333-000000000008', 'b0000004-1111-4111-8111-000000000004', 'lead'),
('d0000008-3333-4333-8333-000000000008', 'b0000007-1111-4111-8111-000000000007', 'support');

-- ============================================================================
-- INSIGHTS (6 articles éditoriaux)
-- ============================================================================
-- Article 1 — CSRD ----------------------------------------------------------
insert into public.insights (
  id, slug, title, subtitle, excerpt, content, category, author_id,
  published_at, is_published, reading_time_minutes
) values (
  'a0000001-4444-4444-8444-000000000001',
  'csrd-cinq-implications-strategiques-conseils-administration',
  'La nouvelle directive européenne CSRD : 5 implications stratégiques pour les conseils d''administration',
  'Au-delà du reporting : un changement structurel pour la gouvernance des grandes entreprises',
  'La CSRD ne se réduit pas à un exercice de reporting supplémentaire. Elle redéfinit la responsabilité des conseils d''administration sur les enjeux de durabilité et impose une discipline analytique nouvelle aux directions générales.',
  $content$
La directive (UE) 2022/2464 dite **CSRD** (Corporate Sustainability Reporting Directive) marque une rupture qualitative par rapport au régime NFRD qui la précédait. Pour la première fois, les obligations de reporting extra-financier sont alignées sur le niveau d'exigence et de granularité du reporting financier — avec audit indépendant, format numérique structuré et standards européens contraignants (les ESRS). Trois ans après son adoption, et alors que les premières publications sont intervenues sur l'exercice 2024, les conseils d'administration belges doivent intégrer cinq implications stratégiques majeures.

## 1. Un périmètre élargi qui dépasse les grandes entreprises cotées

Le périmètre de la CSRD couvre désormais l'ensemble des grandes entreprises (cotées ou non) répondant à au moins deux des trois critères : 250 salariés, 50M€ de chiffre d'affaires, 25M€ de total bilan. À cela s'ajoute, à compter de 2026, l'extension aux PME cotées (avec un régime simplifié). L'effet de cascade contractuel est tout aussi important : les groupes assujettis exigent désormais de leurs fournisseurs des données ESG structurées, ce qui propage de facto les obligations à tout l'écosystème.

## 2. La double matérialité comme cadre d'analyse imposé

Le cœur méthodologique de la CSRD est la **double matérialité** : l'entreprise doit identifier d'une part les enjeux ESG qui pèsent matériellement sur sa valeur (matérialité financière), d'autre part ceux sur lesquels son activité produit des impacts matériels sur l'environnement et la société (matérialité d'impact). Ce double exercice impose une cartographie systématique des chaînes de valeur et une discipline analytique que peu d'entreprises maîtrisaient avant 2024. Pour les conseils d'administration, c'est l'occasion d'arbitrer explicitement entre des enjeux qui restaient jusque-là implicites.

## 3. Une assurance limitée aujourd'hui, raisonnable demain

Contrairement au régime NFRD, le rapport de durabilité CSRD est soumis à une **assurance externe**. À ce stade, le niveau exigé est une assurance limitée (limited assurance), équivalente à une revue plutôt qu'à un audit. Mais la directive prévoit une montée en puissance vers une assurance raisonnable (équivalent audit financier) à l'horizon 2028-2030. Les conseils doivent dès maintenant anticiper cette trajectoire : les processus internes, les systèmes d'information et les pistes d'audit doivent être robustes dès le premier exercice — sous peine de devoir tout reconstruire dans trois ans.

## 4. Un reporting digitalisé en XBRL et accessible aux IA

Le rapport CSRD est publié dans le format **ESEF/XHTML avec balisage XBRL**, c'est-à-dire structuré et machine-readable. Cette caractéristique change la donne : les analystes financiers, ONG, fonds activistes et régulateurs disposent désormais de données ESG comparables et exploitables par des modèles automatisés. Les contradictions entre la communication corporate (rapport intégré, site web, déclarations CEO) et le rapport CSRD seront détectées en quelques minutes par des outils d'analyse. La cohérence narrative devient un enjeu juridique de premier plan.

## 5. Une responsabilité accrue des administrateurs

La directive impose explicitement que le conseil d'administration **approuve** le rapport de durabilité et que les administrateurs soient **collectivement et individuellement responsables** de sa conformité. En droit belge, cette responsabilité s'inscrit dans le cadre général de la responsabilité civile et pénale des administrateurs. À cela s'ajoute le risque réputationnel et l'exposition aux actions collectives de stakeholders : la directive sur la diligence raisonnable (CSDDD), adoptée en 2024, ouvre des bases d'action additionnelles.

## Conclusion : trois priorités pour 2026

Pour les conseils d'administration belges, trois priorités s'imposent dans les douze prochains mois. **Premièrement**, mettre en place une gouvernance ESG dédiée : comité ad hoc ou intégration explicite dans le comité d'audit, lettre de mission claire, ressources internes identifiées. **Deuxièmement**, investir dans les systèmes d'information : la qualité des données ESG conditionne tout le reste, et la dette technique en la matière est élevée chez la plupart des groupes. **Troisièmement**, aligner la stratégie corporate sur la matrice de double matérialité : un rapport CSRD qui contredit la stratégie publiée est une faute managériale et un risque contentieux.

La CSRD n'est pas un exercice de communication. Elle est une discipline de gouvernance qui s'imposera durablement.
$content$,
  'Regulatory',
  'b0000004-1111-4111-8111-000000000004',
  '2026-01-15 09:00:00+01',
  true,
  7
);

-- Article 2 — W&I Insurance --------------------------------------------------
insert into public.insights (
  id, slug, title, subtitle, excerpt, content, category, author_id,
  published_at, is_published, reading_time_minutes
) values (
  'a0000002-4444-4444-8444-000000000002',
  'wi-insurance-ma-belgique-retour-experience-2025',
  'W&I Insurance dans les opérations M&A belges : retour d''expérience 2025',
  'Le marché belge a basculé : ce que les vendeurs et acheteurs doivent savoir avant la prochaine transaction',
  'En quelques années, l''assurance W&I s''est imposée comme un standard sur les transactions belges de plus de 30M€. Retour sur les évolutions du marché en 2025 et les meilleures pratiques observées.',
  $content$
L'assurance **Warranty & Indemnity** (W&I) couvre l'acheteur, ou plus rarement le vendeur, contre les conséquences d'une violation des garanties contractuelles ou d'une indemnité de pré-closing. Marginal en Belgique avant 2018, ce produit s'est imposé comme un quasi-standard sur les transactions de mid-market et large-cap. L'année 2025 marque une nouvelle étape de maturité du marché belge, avec des évolutions tangibles côté primes, périmètres couverts et pratique de souscription.

## Un marché qui s'élargit vers le mid-market

Historiquement, la W&I était réservée aux grandes opérations de Private Equity et aux deals stratégiques de plus de 100M€. Cette barrière s'est érodée. En 2025, nous observons une démocratisation vers le segment 30-100M€, portée par l'arrivée de plusieurs assureurs spécialisés sur le marché belge et par la baisse des primes (voir infra). Sur les transactions où le vendeur est un fonds ou une famille soucieuse d'un clean exit, la W&I est devenue le premier réflexe — y compris sur des deals à 40-50M€ qui auraient été jugés trop petits il y a cinq ans.

## Primes en baisse, rétention en hausse

Les primes pour une couverture standard ont baissé d'environ 20% entre 2022 et 2025, sous l'effet de la concurrence accrue. La fourchette typique pour un deal mid-market belge se situe désormais entre 0,8% et 1,2% de la limite de couverture, contre 1,2-1,8% en 2022. En contrepartie, les rétentions (équivalent de la franchise) ont tendance à augmenter, passant fréquemment de 0,5% à 0,75% de l'enterprise value, voire 1% sur les secteurs sensibles (santé, infrastructures, énergie).

## Périmètre : ce qui reste exclu

Malgré cette maturité, certains exclusions traditionnelles demeurent. Le **transfer pricing** reste très difficilement assurable en Belgique, à fortiori dans un contexte post-Pilier 2. Les questions de **conformité environnementale** historiques sont également exclues par défaut, sauf à structurer un environmental rep dédié et à obtenir un underwriting spécifique avec des conditions parfois contraignantes (audits Phase I/II préalables). Les **risques de pension** liés aux régimes complémentaires belges restent un point sensible — la matrice de couverture varie significativement d'un assureur à l'autre.

## Coordination buy-side / sell-side : la pratique se professionnalise

Le modèle dominant reste la W&I buy-side, où c'est l'acheteur qui souscrit la police mais où la prime est typiquement partagée 50/50 avec le vendeur. La pratique 2025 montre une professionnalisation de la coordination entre les conseils. Les vendeurs préparent désormais une **vendor due diligence** structurée pour faciliter la souscription et obtiennent des **draft policy schedules** en amont du SPA pour anticiper le no-claims declaration. Côté acheteurs, les **disclosure letters** s'épaississent et la qualité documentaire de la data room conditionne directement le périmètre couvrable.

## Synthetic warranties : une frontière qui bouge

Une tendance émergente en 2025 est l'utilisation de **synthetic warranties**, c'est-à-dire des garanties contractuelles données par le vendeur à l'acheteur uniquement aux fins de la W&I — sans recours possible contre le vendeur. Ce mécanisme, longtemps perçu avec méfiance, s'installe sur les opérations où le vendeur exige un clean exit absolu (fonds en fin de vie, secondary, family exit). Les assureurs belges l'acceptent désormais sur certains périmètres, sous réserve d'une documentation rigoureuse.

## Impact sur la négociation : la fin de l'escrow standard

L'effet le plus tangible sur la pratique transactionnelle est la **réduction des escrows**. Sur un deal classique sans W&I, un escrow de 8-12% de l'EV pendant 18-24 mois était la norme. Avec W&I, l'escrow peut être réduit à 1-2% (voire éliminé sur les opérations à fort levier de négociation côté vendeur). Pour le vendeur, c'est un gain significatif de liquidité immédiate. Pour l'acheteur, c'est une exposition contre-partie réduite.

## Recommandations pratiques

Trois recommandations s'imposent pour les opérations 2026. **Premièrement**, impliquer les courtiers W&I dès la phase de term sheet — la souscription prend typiquement 4 à 6 semaines et conditionne le calendrier global. **Deuxièmement**, allouer un budget dédié à la VDD et à la qualité de data room : les économies réalisées sur la prime sont supérieures à l'investissement. **Troisièmement**, lire attentivement les exclusions : une W&I mal négociée donne une fausse sécurité sur des risques qui restent à la charge des parties.

La W&I n'est pas une formalité. Bien utilisée, elle restructure l'économie de la transaction au bénéfice des deux parties.
$content$,
  'M&A',
  'b0000001-1111-4111-8111-000000000001',
  '2026-02-08 09:00:00+01',
  true,
  8
);

-- Article 3 — Pilier 2 OCDE --------------------------------------------------
insert into public.insights (
  id, slug, title, subtitle, excerpt, content, category, author_id,
  published_at, is_published, reading_time_minutes
) values (
  'a0000003-4444-4444-8444-000000000003',
  'pilier-2-ocde-groupes-belges-anticipation-2026',
  'Pilier 2 OCDE : ce que les groupes belges doivent anticiper en 2026',
  'L''entrée en application des règles GloBE redessine la fiscalité internationale — et impose une discipline opérationnelle nouvelle aux directions fiscales',
  'Le mécanisme du taux minimum mondial de 15% s''applique désormais aux groupes belges dépassant 750M€ de chiffre d''affaires. Au-delà du calcul du Top-up Tax, c''est toute l''organisation fiscale qui doit s''adapter.',
  $content$
Le **Pilier 2** de l'OCDE, transposé en droit belge par la loi du 19 décembre 2023, est entré en application progressive depuis l'exercice 2024. Pour les groupes multinationaux belges dépassant le seuil de 750M€ de chiffre d'affaires consolidé, l'année 2026 est l'année de la première déclaration GIR (GloBE Information Return) et du premier paiement éventuel d'un Top-up Tax. Quatre points méritent une vigilance particulière.

## Le mécanisme : un taux effectif minimum de 15% par juridiction

Le Pilier 2 instaure un taux d'imposition effectif (TIE) minimum de **15% calculé par juridiction**, sur la base d'une définition harmonisée du résultat (GloBE Income) et de l'impôt couvert (Covered Taxes). Si le TIE d'une juridiction est inférieur à 15%, le différentiel constitue un Top-up Tax qui est dû soit dans la juridiction concernée (via le Qualified Domestic Minimum Top-up Tax — QDMTT), soit, à défaut, par la mère ultime via le mécanisme IIR (Income Inclusion Rule), soit en dernier recours par les autres entités du groupe via l'UTPR (Undertaxed Payments Rule).

La Belgique a opté pour un **QDMTT belge** entré en application le 31 décembre 2023, ce qui signifie que tout Top-up Tax dû sur des bénéfices de source belge est perçu en Belgique avant qu'il ne puisse l'être ailleurs. Cette stratégie défensive est cohérente avec celle de la plupart des États européens.

## Pourquoi le sujet ne se résume pas au taux nominal de 25%

Le réflexe initial des CFO belges a été de se rassurer en raison du taux nominal d'IPM de 25%, largement supérieur au seuil de 15%. Cette analyse est trompeuse. Le taux effectif tel que calculé selon les règles GloBE peut être significativement inférieur au taux nominal, en raison de plusieurs régimes spécifiques belges : la **déduction pour revenus d'innovation** (innovation income deduction), les **régimes RDT/dividendes étrangers**, le **tax shelter audiovisuel**, ou encore les **régimes patent box résiduels**. Sur certaines configurations, des entités belges historiquement fiscalisées à un TIE GloBE de 8-12% ont été identifiées en 2024.

Pour ces entités, soit le QDMTT belge sera dû et constituera une charge fiscale additionnelle réelle, soit il faudra restructurer pour réintégrer dans le calcul GloBE des éléments aujourd'hui exclus.

## Une charge opérationnelle considérable pour les directions fiscales

Au-delà de l'enjeu financier, la véritable difficulté du Pilier 2 est **opérationnelle**. Le calcul du TIE par juridiction requiert :
- Le retraitement de la comptabilité statutaire ou consolidée pour passer au GloBE Income (plus de 50 ajustements potentiels)
- Le mapping précis des Covered Taxes (impôts sur le revenu, mais aussi certaines taxes assimilées et exclusion de certaines retenues)
- L'identification des **Constituent Entities** (entités constitutives) et leur rattachement juridictionnel — qui n'est pas toujours évident pour les structures hybrides ou les MJV
- La gestion des **Safe Harbours** transitoires (CbCR Safe Harbour applicable jusqu'en 2026, puis simplified calculations)

Plusieurs groupes belges nous rapportent un surcoût annuel de 200-400k€ en ressources internes et conseils externes pour la conformité Pilier 2. Pour les groupes opérant dans plus de 30 juridictions, la facture peut dépasser 1M€.

## Calendrier 2026-2027 et déclarations à anticiper

La GIR (déclaration GloBE) doit être déposée dans les **15 mois suivant la clôture** de l'exercice (18 mois pour la première déclaration). Pour un groupe belge clôturant au 31 décembre 2024, la première GIR est due au plus tard le 30 juin 2026. Le QDMTT belge fait l'objet d'une **déclaration belge spécifique** distincte, dont les modalités ont été précisées par arrêté royal en juillet 2025.

Concrètement, les groupes doivent dès aujourd'hui :
1. **Cartographier** leur empreinte juridictionnelle GloBE et identifier les juridictions à risque (TIE < 15% probable)
2. **Configurer** leur ERP et leur consolidation pour produire les inputs GloBE de manière reproductible
3. **Documenter** les positions retenues sur les ajustements GloBE — la robustesse documentaire conditionne la défense en cas de contrôle
4. **Anticiper** les restructurations éventuelles, sachant que certaines optimisations historiques perdent leur intérêt sous Pilier 2

## Conclusion : une discipline durable

Le Pilier 2 n'est pas un événement ponctuel. C'est une discipline fiscale et opérationnelle durable qui s'impose pour la décennie. Les groupes qui y voient une simple charge de conformité passent à côté d'une opportunité : la structuration GloBE-aware peut, dans certaines configurations, simplifier l'architecture fiscale globale et réduire la complexité héritée des deux décennies précédentes. Les directions fiscales qui auront fait ce travail en 2026-2027 disposeront d'un avantage durable.
$content$,
  'Tax',
  'b0000003-1111-4111-8111-000000000003',
  '2026-03-12 09:00:00+01',
  true,
  9
);

-- Article 4 — Class actions belges -----------------------------------------
insert into public.insights (
  id, slug, title, subtitle, excerpt, content, category, author_id,
  published_at, is_published, reading_time_minutes
) values (
  'a0000004-4444-4444-8444-000000000004',
  'class-actions-belges-bilan-trois-ans-reforme',
  'Class actions à la belge : trois ans après la réforme, quel bilan ?',
  'L''action en réparation collective belge se cherche encore — mais les signaux d''accélération sont réels',
  'La directive (UE) 2020/1828 et sa transposition belge ont remodelé le paysage des actions collectives. Trois ans plus tard, le bilan est nuancé : peu d''actions menées à terme, mais une infrastructure procédurale qui se met en place.',
  $content$
L'action en réparation collective belge, introduite en 2014 puis étendue en 2018, a connu une nouvelle évolution avec la transposition par la loi du 21 juin 2023 de la directive (UE) 2020/1828 sur les actions représentatives. Trois ans après cette réforme, le bilan opérationnel mérite une analyse nuancée. Le dispositif belge reste sous-utilisé en comparaison de ses voisins (Pays-Bas, Allemagne) mais l'infrastructure procédurale se met progressivement en place.

## Le cadre actuel : quatre piliers structurants

Le régime belge issu de la transposition 2023 repose sur quatre piliers. **Premièrement**, la qualité pour agir est ouverte aux organisations de défense des consommateurs reconnues, mais aussi désormais aux **entités qualifiées d'autres États membres** pour les actions transfrontalières. **Deuxièmement**, le périmètre matériel a été élargi au-delà du droit de la consommation pour couvrir une vingtaine de domaines (RGPD, services financiers, énergie, télécoms, etc.). **Troisièmement**, le tribunal compétent est centralisé : le tribunal de l'entreprise francophone ou néerlandophone de Bruxelles, selon la langue de l'organisation requérante. **Quatrièmement**, le système opt-out reste possible pour les consommateurs résidant en Belgique au moment de l'introduction de l'action — distinction importante par rapport au modèle opt-in dominant en Europe.

## Bilan quantitatif : peu d'actions, mais des dossiers structurants

Sur la période 2023-2025, environ une dizaine d'actions en réparation collective ont été introduites devant le tribunal de l'entreprise de Bruxelles. C'est peu en valeur absolue, mais plusieurs dossiers ont une portée structurante. Le contentieux **Volkswagen Dieselgate**, initié en 2018 et toujours en cours, a passé l'étape de la recevabilité et la phase de négociation collective est en cours. Le dossier **Apple iPhone batteries**, plus récent, a abouti à un accord transactionnel homologué en 2024 prévoyant une indemnisation forfaitaire pour les utilisateurs belges éligibles.

D'autres dossiers ont été initiés sur des secteurs nouveaux : un litige RGPD contre un acteur du secteur du transport, une action contre un fournisseur d'énergie pour pratiques tarifaires contestées, une procédure contre une plateforme numérique pour clauses abusives. Ces dossiers testent les limites du dispositif et produiront une jurisprudence dans les 18-24 prochains mois.

## Différences fondamentales avec les class actions américaines

Pour les directions juridiques de groupes internationaux, la confusion avec le modèle américain reste fréquente — et dangereuse. Trois différences majeures structurent la pratique belge.

D'abord, **les dommages punitifs n'existent pas** en droit belge. Le préjudice indemnisé est strictement compensatoire, ce qui plafonne mécaniquement l'enjeu financier. Les indemnisations moyennes par bénéficiaire restent modestes (typiquement 50-500€), ce qui rend la rentabilité économique d'une action collective faible — sauf cas de masse exceptionnelle.

Ensuite, **les honoraires de résultat conditionnels (success fees) ne sont pas autorisés** en Belgique, ce qui réduit considérablement l'incitation économique des avocats à initier des actions. Les organisations requérantes doivent assumer un coût procédural significatif sans garantie de retour.

Enfin, le **third-party litigation funding** reste marginal en Belgique, contrairement à l'écosystème néerlandais ou allemand où il s'est structuré rapidement. La directive 2020/1828 prévoit un encadrement, mais l'écosystème pratique reste embryonnaire.

## La directive collective redress : un standard européen en construction

La directive 2020/1828 et sa transposition coordonnée à travers les 27 États membres dessinent progressivement un **standard européen des actions collectives**. La portabilité d'une action d'un État à l'autre, la coordination transfrontalière des entités qualifiées et l'harmonisation progressive des règles de preuve produisent un effet d'apprentissage et de scaling. Pour les défendeurs européens, cela signifie qu'une stratégie de défense purement nationale est de plus en plus inadaptée — il faut anticiper la dimension transfrontalière dès le départ.

## Perspectives 2026-2028

Trois tendances vont structurer les prochaines années. **D'abord**, l'arrivée probable d'un acteur structurant côté requérant — qu'il s'agisse d'une fondation dédiée ou d'un cabinet plaintiff spécialisé — qui changera la dynamique économique. **Ensuite**, la jurisprudence des premières affaires arbitrera des points cruciaux : critère du caractère collectif du dommage, articulation opt-in/opt-out, coordination avec les actions individuelles parallèles. **Enfin**, la sensibilité accrue des consommateurs et des médias aux enjeux ESG et data protection multipliera mécaniquement les dossiers à fort potentiel collectif.

## Recommandations pour les directions juridiques

Dans ce contexte, trois recommandations s'imposent. **Cartographier** les expositions collectives latentes (clauses contractuelles standard, pratiques tarifaires, traitement des données personnelles) — la plupart des actions ne portent pas sur des fautes lourdes mais sur des pratiques de masse. **Préparer** des dispositifs de remédiation rapide : un rappel volontaire ou une transaction proactive coûte typiquement 3 à 5 fois moins qu'une action collective menée à son terme. **Documenter** les processus de conformité : la qualité documentaire conditionne entièrement la défense en cas de litige.

Le système belge reste imparfait. Mais il fonctionne, il s'apprend et il s'amplifiera.
$content$,
  'Litigation',
  'b0000002-1111-4111-8111-000000000002',
  '2026-04-02 09:00:00+02',
  true,
  9
);

-- Article 5 — Continuation Funds -------------------------------------------
insert into public.insights (
  id, slug, title, subtitle, excerpt, content, category, author_id,
  published_at, is_published, reading_time_minutes
) values (
  'a0000005-4444-4444-8444-000000000005',
  'continuation-funds-nouvelle-frontiere-private-equity-europeen',
  'Continuation Funds : la nouvelle frontière du Private Equity européen',
  'Le marché européen rattrape les États-Unis — avec une accélération particulièrement marquée depuis 2024',
  'Les continuation funds ne sont plus une niche. En 2025, ils représentent une part significative du volume secondaire européen et redéfinissent la durée de détention des actifs PE. Décryptage juridique.',
  $content$
Les **continuation funds** — ou véhicules de continuation — étaient encore perçus en 2020 comme un instrument américain marginal. Ils représentent désormais l'une des innovations structurantes du Private Equity européen. Le marché secondaire européen a atteint en 2024 un volume record, dont environ un tiers via des continuation vehicles. La pratique se complexifie, le cadre régulatoire se précise, et les enjeux juridiques se déplacent.

## Définition : un fonds qui détient un (ou plusieurs) actifs déjà connus du GP

Un continuation fund est un nouveau véhicule d'investissement levé par le General Partner (GP) d'un fonds existant pour acquérir un ou plusieurs actifs détenus par ce fonds. Les Limited Partners (LPs) du fonds original ont alors deux options : sortir au prix négocié (cash-out) ou rouler leur participation dans le nouveau véhicule (rollover).

La structure se décline en deux formats principaux. Le **single-asset CV** (Continuation Vehicle) porte sur un actif unique — typiquement la participation phare ("trophy asset") d'un fonds en fin de vie que le GP souhaite conserver pour capter une création de valeur résiduelle. Le **multi-asset CV** porte sur plusieurs actifs, souvent l'ensemble du portefeuille résiduel d'un fonds en fin de vie (5-10 ans après son lancement initial).

## Pourquoi cette explosion depuis 2023 ?

Trois facteurs convergents expliquent l'accélération européenne.

**D'abord**, l'allongement structurel des durées de détention. La fenêtre de marché plus restreinte pour les exits IPO ou trade sale, conjuguée à la difficulté de revaloriser certains actifs dans un contexte de taux élevés, crée des situations où le GP ne peut ni vendre dans les conditions souhaitées, ni étendre indéfiniment le fonds (le LPA prévoit typiquement une extension limitée à 2-3 ans).

**Ensuite**, la maturité de l'écosystème des secondary buyers européens. Coller, Ardian, Strategic Partners, Pantheon, Lexington et d'autres ont massivement levé des fonds dédiés ces trois dernières années, créant la liquidité nécessaire pour absorber des transactions de plus en plus grandes (deals supérieurs à 1Md€ devenus courants).

**Enfin**, la sophistication des LPs européens, qui acceptent désormais le mécanisme dans son principe — sous réserve d'une gouvernance rigoureuse.

## Les conflits d'intérêts : le cœur de l'analyse juridique

Le continuation fund est, par construction, une transaction entre parties liées : le GP est à la fois vendeur (pour le compte du fonds original) et acheteur (pour le compte du CV qu'il gère également). Cette situation crée un conflit d'intérêts majeur que le cadre juridique encadre de manière de plus en plus précise.

L'**ILPA** (Institutional Limited Partners Association) a publié des guidelines actualisées en 2023 qui structurent désormais la pratique. Trois mécanismes-clés s'imposent :

1. Un **fairness opinion** délivré par un conseil financier indépendant qui valide le prix de la transaction
2. Un **LPAC consent** (LP Advisory Committee) du fonds vendeur sur la transaction
3. Une période de **rollover decision** d'au moins 20-30 jours pour permettre aux LPs de prendre une décision informée
4. Une transparence renforcée sur la **carry crystallization** et le **GP commitment** au CV

## Cadre régulatoire européen : AIFMD II et au-delà

La directive AIFMD II, adoptée en mars 2024, ne traite pas spécifiquement des continuation funds — mais elle introduit plusieurs dispositions qui les concernent indirectement, notamment sur la transparence des frais, la liquidité et la gestion des conflits d'intérêts. Plus structurant : l'**ESMA** travaille sur des recommandations spécifiques aux GP-led secondaries, avec un projet de Q&A attendu pour 2026. Au niveau national, la CSSF luxembourgeoise et la BaFin allemande ont déjà publié des positions encadrant l'exercice.

## Aspects fiscaux : le terrain le plus complexe

L'analyse fiscale d'une opération CV est particulièrement délicate. Quatre points méritent une vigilance maximale :

- Le **traitement de la cession** côté fonds vendeur : selon la juridiction des LPs et la structure du fonds, la cession peut générer des plus-values imposables, des effets de step-up au niveau du véhicule, ou des frottements TVA sur les management fees.
- Le **régime du carry interest** cristallisé à l'occasion de la transaction : selon les juridictions, le carry peut être imposé immédiatement ou différé, avec des conséquences significatives pour les équipes du GP.
- Les **rollover mechanics** côté LP : la qualification du rollover comme cession ou simple substitution conditionne le moment d'imposition.
- La **structuration du nouveau véhicule** : choix de la juridiction de domiciliation, structure SCA/SCSp/Luxembourg vs Delaware, traitement des hybrides.

## Recommandations pratiques pour 2026

Pour les GP envisageant un continuation fund, trois recommandations émergent de notre pratique. **Premièrement**, anticiper la structuration au moins 9-12 mois avant le closing : la diligence des secondary buyers, la mobilisation des LPs et la documentation prennent ce temps. **Deuxièmement**, soigner la fairness opinion : le choix du conseiller, la méthode de valorisation et la documentation de la procédure conditionnent la défense en cas de contestation ultérieure. **Troisièmement**, communiquer tôt et clairement avec les LPs — l'expérience montre que les CV qui se passent bien sont ceux où la pédagogie a précédé la transaction.

Le continuation fund est un instrument puissant. Mal structuré, il devient une bombe juridique à retardement.
$content$,
  'Corporate',
  'b0000006-1111-4111-8111-000000000006',
  '2026-04-22 09:00:00+02',
  true,
  9
);

-- Article 6 — Insolvabilité transfrontalière post-Brexit -------------------
insert into public.insights (
  id, slug, title, subtitle, excerpt, content, category, author_id,
  published_at, is_published, reading_time_minutes
) values (
  'a0000006-4444-4444-8444-000000000006',
  'insolvabilite-transfrontaliere-post-brexit-droit-belge-uk',
  'Insolvabilité transfrontalière post-Brexit : naviguer entre droit belge et procédures UK',
  'Cinq ans après le Brexit, le pont juridique entre Bruxelles et Londres reste à reconstruire — au cas par cas',
  'Le règlement européen sur les procédures d''insolvabilité ne s''applique plus aux procédures britanniques. La pratique belgo-britannique a dû s''adapter, avec des solutions pragmatiques mais parfois fragiles.',
  $content$
Le **règlement (UE) 2015/848** sur les procédures d'insolvabilité a été le pilier de la coordination des faillites transfrontalières au sein de l'Union pendant deux décennies. Depuis le 1er janvier 2021, le Royaume-Uni n'en bénéficie plus. Cinq ans après, les opérateurs économiques actifs sur les deux marchés doivent composer avec un cadre fragmenté, qui produit des situations parfois absurdes — et des opportunités pour qui sait les utiliser.

## L'avant-Brexit : un cadre coordonné

Sous le règlement 2015/848, une procédure d'insolvabilité ouverte dans un État membre était automatiquement reconnue dans tous les autres. Le concept de **COMI** (Centre Of Main Interests) déterminait la juridiction principale, et des procédures secondaires pouvaient être ouvertes dans les autres juridictions où le débiteur exploitait un établissement. La coordination entre praticiens était formalisée et la jurisprudence de la CJUE garantissait l'unité d'interprétation. Pour les groupes belgo-britanniques, ce cadre permettait une administration relativement fluide des défaillances.

## La situation actuelle : un patchwork pragmatique

Depuis 2021, plusieurs régimes coexistent.

**Côté UK**, les procédures d'insolvabilité belges ne bénéficient plus de la reconnaissance automatique. Le Royaume-Uni continue d'appliquer le **Cross-Border Insolvency Regulations 2006**, transposant la **Loi-modèle CNUDCI**. Cela permet à un mandataire de justice belge de demander la reconnaissance d'une procédure principale belge devant la Chancery Division de la High Court — mais avec une procédure judiciaire effective, des coûts significatifs et un délai de 2-4 mois.

**Côté Belgique**, la situation est plus problématique. La Belgique n'a **pas transposé** la Loi-modèle CNUDCI sur les procédures d'insolvabilité. La reconnaissance d'une procédure britannique repose donc sur le droit international privé belge classique (CODIP), avec des conditions plus strictes et une appréciation discrétionnaire au cas par cas par les tribunaux belges.

Cette asymétrie est à l'origine de plusieurs blocages observés ces dernières années — notamment lorsqu'un administrator britannique tente de saisir des actifs belges du débiteur sans procédure secondaire belge.

## Pourquoi la non-transposition belge est un problème

L'absence de transposition de la Loi-modèle CNUDCI place la Belgique dans une position défavorable par rapport à ses voisins (France, Pays-Bas, Royaume-Uni, Allemagne dans une certaine mesure). Concrètement :

- Les **mandataires britanniques** peinent à obtenir des injonctions efficaces contre les créanciers belges qui poursuivraient des actions individuelles
- Les **schemes of arrangement** et **restructuring plans** britanniques (équivalents fonctionnels des procédures de réorganisation belges) ne sont pas reconnus de plein droit en Belgique
- L'**hostile creditor venue shopping** redevient possible : un créancier insatisfait par un scheme britannique peut tenter une action devant les tribunaux belges

Plusieurs propositions de transposition ont été déposées au Parlement fédéral depuis 2022 mais n'ont pas abouti. La législature 2024-2029 devrait permettre une avancée, mais le calendrier reste incertain.

## Coordination informelle BE/UK : les bonnes pratiques

Dans ce contexte fragmenté, les praticiens ont développé des **mécanismes informels** de coordination qui fonctionnent bien lorsque les parties coopèrent :

- **Protocoles de coordination** entre administrators britanniques et mandataires belges, inspirés des **CoCo Guidelines** et de **JIN Guidelines** (Judicial Insolvency Network)
- **Procédures parallèles synchronisées** : ouverture simultanée d'une PRJ belge et d'un administration britannique, avec communication régulière entre les praticiens
- **Schemes of arrangement** (UK) coordonnés avec des **plans de réorganisation** belges, lorsque la structure du groupe le permet

Ces mécanismes informels ne remplacent pas un cadre légal solide mais permettent, dans la majorité des cas réussis, de gérer pragmatiquement les défaillances transfrontalières.

## L'attractivité retrouvée des schemes anglais

Paradoxe : le Brexit a renforcé l'attractivité des **schemes of arrangement** et des **restructuring plans** anglais pour les groupes européens, y compris belges. Plusieurs raisons à cela. La sophistication procédurale britannique reste sans équivalent en Europe. Les juges spécialisés (Insolvency and Companies Court) maîtrisent des dossiers complexes plus rapidement que les juridictions belges. Le seuil de 75% requis pour adopter un scheme est strictement appliqué mais avec des techniques de class composition raffinées.

Plusieurs groupes belges ont en 2024-2025 utilisé un scheme anglais comme **outil de restructuration** alors même que leur COMI restait en Belgique — moyennant l'ouverture d'une "branch" britannique pour ancrer la juridiction. Cette pratique reste marginale mais croissante.

## Recommandations pour les groupes belgo-britanniques

Pour les groupes opérant des deux côtés du Channel, trois recommandations s'imposent.

**Premièrement**, cartographier précisément la structure juridique et financière du groupe, en identifiant les zones de fragilité : créanciers transfrontaliers, garanties intra-groupe, sûretés sur actifs étrangers. Une **insolvency playbook** par juridiction est devenue indispensable.

**Deuxièmement**, anticiper les procédures bien en amont d'une crise : 6-12 mois avant un défaut probable, le choix de la juridiction d'ouverture conditionne en grande partie l'issue économique. Le COMI shifting — déplacement légitime du centre des intérêts principaux — reste un outil discutable mais utilisé.

**Troisièmement**, soigner les **clauses de juridiction et de droit applicable** dans les financements transfrontaliers. Les choix faits en phase de financement structurent la marge de manœuvre en restructuring.

L'écosystème belgo-britannique post-Brexit reste fonctionnel — à condition d'en connaître les pièges et les zones grises.
$content$,
  'Litigation',
  'b0000004-1111-4111-8111-000000000004',
  '2026-04-28 09:00:00+02',
  true,
  10
);
