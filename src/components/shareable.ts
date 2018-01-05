import { SocialSharing } from '@ionic-native/social-sharing';

export class Shareable {
    private static socialSharing: SocialSharing = new SocialSharing();
    constructor() { }

    static share(imgb64: string) {
        console.log('Called Shareable.share');
        try {
            Shareable.socialSharing.share(
                'Meme',
                'Memeology',
                imgb64
            );
        } catch (e) {
            console.error("Error when trying to use social-sharing!");
            console.error(e);
            throw e;
        }
    }
}