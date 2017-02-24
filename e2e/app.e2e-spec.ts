import { OpenPicsPage } from './app.po';

describe('open-pics App', () => {
  let page: OpenPicsPage;

  beforeEach(() => {
    page = new OpenPicsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
