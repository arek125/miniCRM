import { MiniCrmPage } from './app.po';

describe('mini-crm App', () => {
  let page: MiniCrmPage;

  beforeEach(() => {
    page = new MiniCrmPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
