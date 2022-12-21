export default class ApiServise {
  constructor() {
    this.url =
      'https://pixabay.com/api/?key=32096004-1f4392f276e3c051488c74ed0';
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  fetchPhotos() {
    return fetch(
      `${this.url}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`
    ).then(response => {
      this.page += 1;
      return response.json();
    });
  }

  resetPageCount() {
    this.page = 1;
  }
}
