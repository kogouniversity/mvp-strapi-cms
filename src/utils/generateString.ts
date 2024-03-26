import redis from './redis';

export function generateRandomString(length: number) {
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i += 1) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
    }

    return result;
}

interface GenerateUniqueStringParams {
    userId: string;
    keyName: string;
    stringLength?: number;
    overwriteIfExist?: boolean;
}
/**
 * Generate unique string for user using Redis.
 * @param userId
 * @param keyName key name to be used as a sorted set key for Redis
 * @param stringLength length of the unique string
 * @param overwriteIfExist if false, then it will return False if a record exists and is not expired yet for the user
 * @returns {string} generated unique id, throw error if a record already existed and overwriteIfExist is set to false
 */
export async function generateUniqueStringForUser({
    userId,
    keyName,
    stringLength = 6,
    overwriteIfExist = false,
}: GenerateUniqueStringParams) {
    if (!overwriteIfExist) {
        const record = await redis()
            .zmscore(keyName, userId)
            .catch(() => null);
        if (record) throw new Error('Record already exists for a user.');
    }

    const randomString = generateRandomString(stringLength);

    const promises = [];
    let idString: string;

    // Increment the generated random string to find an available key in Redis.
    const iterator = (redisKey: string) =>
        new Promise(resolve => {
            const numeric = parseInt(redisKey, 36);
            redis()
                .zrangebyscore(keyName, numeric, numeric)
                .then(records => {
                    if (records > 0) {
                        const next = (parseInt(redisKey, 36) + 1)
                            .toString(36)
                            .replace(/0/g, 'a')
                            .substring(redisKey.length - stringLength);
                        promises.push(iterator(next));
                        resolve(null);
                    } else {
                        resolve(redisKey);
                        idString = redisKey;
                    }
                })
                .catch(() => {
                    throw new Error(`No record is found. key: ${keyName}, range: ${numeric}.`);
                });
        });
    promises.push(iterator(randomString));
    await Promise.all(promises);

    await redis().zadd(keyName, parseInt(idString, 36), userId);
    return idString;
}

interface GetUniqueStringOfUser {
    userId: string;
    keyName: string;
}
export async function getUniqueString({ userId, keyName }: GetUniqueStringOfUser) {
    const numericForm = await redis()
        .zmscore(keyName, userId)
        .catch(() => {
            throw new Error('No record found for a user.');
        });
    return numericForm.toString(36).replace(/0/g, 'a');
}
