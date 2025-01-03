/* eslint-disable func-names */
import { hit, noopFunc } from '../helpers';

/**
 * @redirect gemius
 *
 * @description
 * Mocks Gemius Analytics.
 * https://flowplayer.com/developers/plugins/gemius
 *
 * ### Examples
 *
 * ```adblock
 * ||example.org/gplayer.js$script,redirect=gemius
 * ```
 *
 * @added v1.5.0.
 */
export function Gemius(source) {
    const GemiusPlayer = function () {};
    GemiusPlayer.prototype = {
        setVideoObject: noopFunc,
        newProgram: noopFunc,
        programEvent: noopFunc,
        newAd: noopFunc,
        adEvent: noopFunc,
    };

    window.GemiusPlayer = GemiusPlayer;

    hit(source);
}

export const GemiusNames = [
    'gemius',
];

// eslint-disable-next-line prefer-destructuring
Gemius.primaryName = GemiusNames[0];

Gemius.injections = [hit, noopFunc];
