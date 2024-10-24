const DENO_KV_PATH_KEY = "DENO_KV_PATH";
let path = undefined;
if (
  (await Deno.permissions.query({ name: "env", variable: DENO_KV_PATH_KEY }))
    .state === "granted"
) {
  path = Deno.env.get(DENO_KV_PATH_KEY);
}
export const kv = await Deno.openKv(path);

// export async function collectValues<T>(iter: Deno.KvListIterator<T>) {
//   return await Array.fromAsync(iter, ({ value }) => value);
// }

// export interface Item {
//   // Uses ULID
//   id: string;
//   userLogin: string;
//   title: string;
//   url: string;
//   score: number;
// }

// export async function createItem(item: Item) {
//   const itemsKey = ["items", item.id];
//   const itemsByUserKey = ["items_by_user", item.userLogin, item.id];

//   const res = await kv.atomic()
//     .check({ key: itemsKey, versionstamp: null })
//     .check({ key: itemsByUserKey, versionstamp: null })
//     .set(itemsKey, item)
//     .set(itemsByUserKey, item)
//     .commit();

//   if (!res.ok) throw new Error("Failed to create item");
// }

// export async function getItem(id: string) {
//   const res = await kv.get<Item>(["items", id]);
//   return res.value;
// }

// export function listItems(options?: Deno.KvListOptions) {
//   return kv.list<Item>({ prefix: ["items"] }, options);
// }

// export function listItemsByUser(
//   userLogin: string,
//   options?: Deno.KvListOptions,
// ) {
//   return kv.list<Item>({ prefix: ["items_by_user", userLogin] }, options);
// }

export interface User {
  // AKA username
  login: string;
  sessionId: string;
}

export async function createUser(user: User) {
  const usersKey = ["users", user.login];
  const usersBySessionKey = ["users_by_session", user.sessionId];

  const atomicOp = kv.atomic()
    .check({ key: usersKey, versionstamp: null })
    .check({ key: usersBySessionKey, versionstamp: null })
    .set(usersKey, user)
    .set(usersBySessionKey, user);

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to create user");
}

export async function updateUser(user: User) {
  const usersKey = ["users", user.login];
  const usersBySessionKey = ["users_by_session", user.sessionId];

  const atomicOp = kv.atomic()
    .set(usersKey, user)
    .set(usersBySessionKey, user);

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to update user");
}

export async function updateUserSession(user: User, sessionId: string) {
  const userKey = ["users", user.login];
  const oldUserBySessionKey = ["users_by_session", user.sessionId];
  const newUserBySessionKey = ["users_by_session", sessionId];
  const newUser: User = { ...user, sessionId };

  const atomicOp = kv.atomic()
    .set(userKey, newUser)
    .delete(oldUserBySessionKey)
    .check({ key: newUserBySessionKey, versionstamp: null })
    .set(newUserBySessionKey, newUser);

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to update user session");
}

export async function getUser(login: string) {
  const res = await kv.get<User>(["users", login]);
  return res.value;
}

export async function getUserBySession(sessionId: string) {
  const key = ["users_by_session", sessionId];
  const eventualRes = await kv.get<User>(key, {
    consistency: "eventual",
  });
  if (eventualRes.value !== null) return eventualRes.value;
  const res = await kv.get<User>(key);
  return res.value;
}

export function listUsers(options?: Deno.KvListOptions) {
  return kv.list<User>({ prefix: ["users"] }, options);
}
