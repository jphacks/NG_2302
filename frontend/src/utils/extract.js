function removeExtension(imgSrc) {
  const replace = imgSrc.replaceAll('_', ' ');
  let nonExtension = replace.split('.');
  nonExtension.pop();
  return nonExtension.join('').split('-');
}

export const extract = {
  artist(imgSrc) {
    const split = removeExtension(imgSrc);
    const artist = split[0];
    return artist;
  },

  songTitle (imgSrc) {
    const split = removeExtension(imgSrc);
    const artist = split[1];
    return artist;
  }
}