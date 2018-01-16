import { Page } from './app.po';

describe('App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('default screen', () => {
    beforeEach(() => {
      page.navigateTo('/');
    });

    it('should have a title saying Memeology', () => {
      page.getTitle().then(title => {
        expect(title).toEqual('Memeology');
      });
    });
  })
});
