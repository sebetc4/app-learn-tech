export const IPC_USER = {
    CREATE: 'user:create',

    GET_CURRENT_USER: 'user:get-current-user',
    SET_CURRENT_USER: 'user:set-current-user',

    GET_ONE: 'user:get-one',
    GET_ALL: 'user:get-all',

    UPDATE: 'user:update',
    UPDATE_THEME: 'user:update-theme',

    DELETE: 'user:delete'
} as const
