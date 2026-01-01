const OFFICIAL_WITCHES = z.enum([
  'UraraShiraishi',
  'NeneOdagiri',
  'MeikoOtsuka',
  'MariaSarushima',
  'NoaTakigawa',
  'MikotoAsuka',
  'RikaSaionji'
]);

export const Schema = z.object({
  world: z.object({
    currentDate: z.string(),
    currentTime: z.string(),
    currentLocation: z.string()
  }),

  protagonist: z.object({
    witchLoreKnowledge: z.record(z.string(), z.string()).prefault({}),

    knownWitches: z.record(
      z.string().describe('witch name'),
      z.object({
        abilityType: z.string().describe('e.g., body_swap, capture, telepathy'),
        discoveredAt: z.string().optional(),
      })
    ).prefault({}),

    currentCopiedAbility: z.object({
      sourceWitch: z.string().nullable().prefault(null),
      abilityName: z.string().nullable().prefault(null),
    }).prefault({}),

    currentBody: z.string().describe('the body current soul inhabits').prefault('<user>'),
  }).prefault({}),

  presentCharacters: z.record(
    z.string().describe('character name'),
    z.object({
      outfit: z.string(),
      state: z.string(),
      thought: z.string().optional(),
    })
  ).prefault({}),

  witchRegistry: z.partialRecord(
    OFFICIAL_WITCHES.describe('witch name: official 7 witches'),
    z.object({
      confessionResult: z.enum([
        'not_confessed',
        'waiting_response',
        'accepted',
        'rejected',
        'pending'
      ]).prefault('not_confessed'),

      intimacy: z.coerce.number().prefault(0),
      trust: z.coerce.number().transform(n => _.clamp(n, 0, 100)).prefault(0),

      kissCount: z.coerce.number().prefault(0),
      isVirgin: z.boolean().prefault(true),

      abilityStatus: z.object({
        abilityName: z.string().prefault(''),
        isActive: z.boolean().prefault(false),
        controlledState: z.object({
          swappedWith: z.string().optional(),
          memoryLoss: z.string().optional().describe('specific memory content lost'),
        }).prefault({}),
      }).prefault({}),

      importantMemory: z.record(
        z.string().describe('event name'),
        z.union([
          z.string().describe('legacy format: simple description'),
          z.object({
            description: z.string(),
            when: z.string().optional().describe('time of event'),
            where: z.string().optional().describe('location of event'),
          })
        ])
      ).prefault({}),
    })
  ).prefault({}).transform(registry => {
    const abilityMap: Record<string, string> = {
      'UraraShiraishi': '交换身体',
      'NeneOdagiri': '恋爱俘获',
      'MeikoOtsuka': '心灵感应',
      'MariaSarushima': '预知未来',
      'NoaTakigawa': '看到过去',
      'MikotoAsuka': '隐形人',
      'RikaSaionji': '消除记忆',
    };
    
    return _.mapValues(registry, (witchData, witchName) => {
      if (witchData) {
        // 设置 abilityName 的默认值
        if (!witchData.abilityStatus.abilityName && abilityMap[witchName]) {
          witchData.abilityStatus.abilityName = abilityMap[witchName];
        }
        
        // 根据 confessionResult 限制 intimacy 上限
        const maxIntimacy = witchData.confessionResult === 'accepted' ? 200 : 100;
        witchData.intimacy = _.clamp(witchData.intimacy, 0, maxIntimacy);
      }
      return witchData;
    });
  }),
});

export type Schema = z.output<typeof Schema>;
