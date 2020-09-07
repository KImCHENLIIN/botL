const ClanData = {
  ClanId: { type: global.Mongo.Types.String, default: undefined },
  GuildId: { type: global.Mongo.Types.String, default: undefined },
  Name: { type: global.Mongo.Types.String, default: undefined },
  RoleID: { type: global.Mongo.Types.String, default: undefined },
  VoiceID: { type: global.Mongo.Types.String, default: undefined },
  Description: { type: global.Mongo.Types.String, default: "Статус не указан." },
  Coins: { type: global.Mongo.Types.Number, default: 0 },
  Xp: { type: global.Mongo.Types.Number, default: 1 },
  Level: { type: global.Mongo.Types.Number, default: 1 },
};
global.MongoDB.addModel("Clan", ClanData);