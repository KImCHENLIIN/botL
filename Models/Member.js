const MemberData = {
  UserId: { type: global.Mongo.Types.String, default: undefined },
  GuildId: { type: global.Mongo.Types.String, default: undefined },
  ClanId: { type: global.Mongo.Types.String, default: undefined },
  Mute: { type: global.Mongo.Types.String, default: null },
  Ban: { type: global.Mongo.Types.String, default: null },
  Coins: { type: global.Mongo.Types.String, default: 0 },
  VoiceTime: { type: global.Mongo.Types.String, default: 0 },
  VoiceTime2: { type: global.Mongo.Types.String, default: 0 },
  BonusTime: { type: global.Mongo.Types.String, default: 0 },
  Warns: { type: global.Mongo.Types.Number, default: 0 },
};
global.MongoDB.addModel("Member", MemberData);