import { q, type SceneInit } from '../util';

// The film is a separate page shown in a frame. It is loaded the first time you reach this act,
// paused when you leave and resumed when you come back.
const init: SceneInit = (root) => {
  const frame = q<HTMLIFrameElement>('#film-frame', root);
  const send = (msg: string) => frame.contentWindow?.postMessage(msg, location.origin);
  return {
    enter() {
      if (!frame.getAttribute('src')) frame.setAttribute('src', frame.dataset.src || '');
      else send('film:play');
    },
    leave() {
      send('film:pause');
    },
  };
};
export default init;
