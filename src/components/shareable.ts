import { SocialSharing } from '@ionic-native/social-sharing';

export class Shareable {
    private static socialSharing: SocialSharing = new SocialSharing();
    constructor() { }

    static share(imgb64) {
        Shareable.socialSharing.share(
            'Memeology Message',
            'Memeology Subject',
            imgb64
        );
    }
}