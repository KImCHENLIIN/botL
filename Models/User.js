const UserData = {
  UserId: { type: global.Mongo.Types.String, default: undefined },
  Partner: { type: global.Mongo.Types.String, default: undefined },
  Sender: { type: global.Mongo.Types.String, default: undefined },
  Coins: { type: global.Mongo.Types.Number, default: 0 },
  Xp: { type: global.Mongo.Types.Number, default: 0 },
  Level: { type: global.Mongo.Types.Number, default: 0 },
  OldMember: { type: global.Mongo.Types.String, default: 0 },
  WorkLevel: { type: global.Mongo.Types.Number, default: 0 },
  WorkTime: { type: global.Mongo.Types.String, default: 0 },
  WorkCount: { type: global.Mongo.Types.Number, default: 0 },
  Rubles: { type: global.Mongo.Types.Number, default: 0 },
  Senders: { type: global.Mongo.Types.Array, default: [] },
  Marks: { type: global.Mongo.Types.Array, default: [] },
  Status: { type: global.Mongo.Types.String, default: "Не указан." }
};
global.MongoDB.addModel("User", UserData);