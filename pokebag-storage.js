/**
 * Simple React Native app that mimics https://pokebag.vercel.app/
 * 
 * Written by AT Mulyana
 * https://github.com/atmulyana/
 *
 * @format
 * @flow strict-local
 */
import {normalizeTitle} from './globals';

/**
 * To save the caught pokemons. Surely, it will be cleared when the app is reloaded.
 * To make it persistent, we need local storage package to replace `#items`.
 */
const pokebag = new class {
    #items = {};

    async addPoke(poke, nickname) {
        nickname = normalizeTitle(nickname);
        if (!nickname) return 'Nickname is required';
        if (this.#items[nickname]) return 'Nickname already exists, use different name';
        this.#items[nickname] = poke;
        return true;
    }

    async removePoke(nickname) {
        delete this.#items[nickname];
    }

    async getAllPokes() {
        return {...this.#items};
    }
};
export default pokebag;