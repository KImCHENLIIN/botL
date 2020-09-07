const GuildData = {
    GuildId: { type: global.Mongo.Types.String, default: undefined },
    AutoRole: { type: global.Mongo.Types.String, default: null },
    MuteRole: { type: global.Mongo.Types.String, default: null },
    blockInvites: { type: global.Mongo.Types.Boolean, default: false },
    Prefix: { type: global.Mongo.Types.String, default: global.config.prefix },
    CmdChannel: { type: global.Mongo.Types.String, default: null },
    privateChannel: { type: global.Mongo.Types.String, default: null },
    ChannelBotCount: { type: global.Mongo.Types.String, default: null },
    ChannelUsersCount: { type: global.Mongo.Types.String, default: null },
    ChannelVoiceOnline: { type: global.Mongo.Types.String, default: null },
    ChannelJoinleave: { type: global.Mongo.Types.String, default: null },
    reportChannel: { type: global.Mongo.Types.String, default: null },
    Shop: { type: global.Mongo.Types.Array, default: [] },
    Verification: { type: global.Mongo.Types.Object, default: null }
};
global.MongoDB.addModel("Guild", GuildData);