export enum ResponseErrorCode {
  EMAIL_LOGIN = 'EMAIL_LOGIN',
  JWT_VALIDATE = 'JWT_VALIDATE',
  USER_ALL_READY_EXISTS = 'USER_ALL_READY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  HASH_NOT_FOUND = 'HASH_NOT_FOUND',
  HASH_WAS_USED = 'HASH_WAS_USED',
  EMAIL_ALL_READY_SUBSCRIBED = 'EMAIL_ALL_READY_SUBSCRIBED',
  BLOCKED_USER = 'BLOCKED_USER',
  UNKNOWN_PROVIDER = 'UNKNOWN_PROVIDER',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  OAUTH_ID_CONFLICT = 'OAUTH_ID_CONFLICT',
  UNCOMPLETED_REGISTRATION = 'UNCOMPLETED_REGISTRATION',
  EMAIL_ALL_READY_EXISTS = 'EMAIL_ALL_READY_EXISTS',
  NICKNAME_ALL_READY_EXISTS = 'NICKNAME_ALL_READY_EXISTS',
  USED_OAUTH = 'USED_OAUTH',

  INVITATION_LINK_NOT_ACTIVE = 'INVITATION_LINK_NOT_ACTIVE',
  INVITATION_LINK_NOT_FOUND = 'INVITATION_LINK_NOT_FOUND',

  ALL_READY_IN_BLACK_LIST = 'ALL_READY_IN_BLACK_LIST',
  IN_BLACK_LIST = 'IN_BLACK_LIST',

  ALL_READY_IN_FRIEND_LIST = 'ALL_READY_IN_FRIEND_LIST',
  ALL_READY_SEND_REQUEST_TO_FRIEND_LIST = 'ALL_READY_SEND_REQUEST_TO_FRIEND_LIST',
  USER_NOT_IN_FRIEND_LIST = 'USER_NOT_IN_FRIEND_LIST',
  FRIEND_REQUEST_NOT_FOUND = 'FRIEND_REQUEST_NOT_FOUND',

  INVALID_ID_PARAMS_TYPE = 'INVALID_ID_PARAMS_TYPE',

  AURA_NOT_AVAILABLE = 'AURA_NOT_AVAILABLE',
  AURA_NOT_FOUND = 'AURA_NOT_FOUND',
  ARMOR_NOT_AVAILABLE = 'ARMOR_NOT_AVAILABLE',
  ARMOR_NOT_FOUND = 'ARMOR_NOT_FOUND',
  WEAPON_NOT_AVAILABLE = 'WEAPON_NOT_AVAILABLE',
  WEAPON_NOT_FOUND = 'WEAPON_NOT_FOUND',
  FLAG_NOT_AVAILABLE = 'FLAG_NOT_AVAILABLE',
  FLAG_NOT_FOUND = 'FLAG_NOT_FOUND',

  AVATAR_NOT_FOUND_BY_PROVIDED_ID = 'AVATAR_NOT_FOUND_BY_PROVIDED_ID',

  BITCOIN_PROVIDER_ERROR = 'BITCOIN_PROVIDER_ERROR',

  EMAIL_NOT_CONFIRMED = 'EMAIL_NOT_CONFIRMED',

  G2FA_TOKEN_IS_NOT_VALID = 'G2FA_TOKEN_IS_NOT_VALID',
  G2FA_NOT_FOUND_VALID_DATA = 'G2FA_NOT_FOUND_DATA',
  G2FA_SETTINGS_UPDATE_ERROR = 'G2FA_SETTINGS_UPDATE_ERROR',
  G2FA_DISABLE_ERROR = 'G2FA_DISABLE_ERROR',
}