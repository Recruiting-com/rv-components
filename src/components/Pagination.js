import React from 'react';

class Pagination extends React.Component {

  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.createPageLinks = this.createPageLinks.bind(this);
    this.getSelectabilityClass = this.getSelectabilityClass.bind(this);
    this.number_of_paginators = props.numberOfPaginators || 7;
  }

  getSelectabilityClass(page) {
    if (page < 1 || page > this.calculateLastPage() || page === this.props.page) {
      return 'not-selectable';
    } else {
      return 'selectable';
    }
  }

  changePageSize(e) {
    const new_page_size = parseInt(e.currentTarget.value, 10);
    const first_record_on_page = (this.props.page * this.props.pageSize) - (this.props.pageSize - 1);
    const new_page = Math.ceil(first_record_on_page / new_page_size);
    this.props.onPageSizeChange && this.props.onPageSizeChange(new_page_size, new_page);
  }

  changePage(page, event) {
    event.preventDefault();

    if (page !== this.props.page && page > 0 && page <= this.calculateLastPage()) {
      this.props.onPageChange && this.props.onPageChange(page);
    }
  }

  calculateStartPage(total_pages) {
    let start_page = 1;
    if (total_pages > this.number_of_paginators && this.props.page > Math.ceil(this.number_of_paginators / 2)) {
      if (this.props.page > total_pages - Math.floor(this.number_of_paginators / 2)) {
        start_page = total_pages - this.number_of_paginators + 1;
      } else {
        start_page = this.props.page - Math.floor(this.number_of_paginators / 2);
      }
    }
    return start_page;
  }

  calculateEndPage(start_page, total_pages) {
    return total_pages > this.number_of_paginators ? start_page + (this.number_of_paginators - 1) : total_pages;
  }

  calculateLastPage() {
    return this.props.total ? Math.ceil(this.props.total / this.props.pageSize) : 1;
  }

  createPageLinks(total_pages) {
    const start_page = this.calculateStartPage(total_pages);
    const end_page = this.calculateEndPage(start_page, total_pages);
    const page_links = [];

    for (let page = start_page; page <= end_page; page++) {
      page_links.push(<a href={this.props.urlForPageNumber(page)} className={`page-link ${page === this.props.page ? 'current-page' : ''} ${this.getSelectabilityClass(page)}`} key={page} onClick={this.changePage.bind(this, page) }>{page}</a>);
    }
    return page_links;
  }

  render() {
    const prev_page = this.props.page - 1;
    const last_page = this.calculateLastPage();
    const next_page = this.props.page + 1 > last_page ? last_page : this.props.page + 1;
    const page_links = this.createPageLinks(last_page);
    const page_options = this.props.pageSizeOptions.map(value => <option key={value} value={value}>{value}</option>);
    const urlForPageNumber = this.props.urlForPageNumber;

    return (
      <div className="pagination">
        <select className="page-size" defaultValue={this.props.pageSize} onChange={this.changePageSize}>
          {page_options}
        </select>
        <div className="page-links">
          <a href={urlForPageNumber(1)} className={`page-link page-link-first ${this.getSelectabilityClass(1)}`} onClick={this.changePage.bind(this, 1) }>{this.props.firstLabel}</a>
          <a href={urlForPageNumber(prev_page)} className={`page-link page-link-previous ${this.getSelectabilityClass(prev_page)}`} onClick={this.changePage.bind(this, prev_page) }>{this.props.previousLabel}</a>
          {page_links}
          <a href={urlForPageNumber(next_page)} className={`page-link page-link-next ${this.getSelectabilityClass(next_page)}`} onClick={this.changePage.bind(this, next_page) }>{this.props.nextLabel}</a>
          <a href={urlForPageNumber(last_page)} className={`page-link page-link-last ${this.getSelectabilityClass(last_page)}`} onClick={this.changePage.bind(this, last_page) }>{this.props.lastLabel}</a>
        </div>
      </div>
    );
  }
}

Pagination.propTypes = {
  pageSize: React.PropTypes.number,
  pageSizeOptions: React.PropTypes.array,
  page: React.PropTypes.number,
  total: React.PropTypes.number,
  onPageSizeChange: React.PropTypes.func,
  onPageChange: React.PropTypes.func,
  numberOfPaginators: React.PropTypes.number,
  firstLabel: React.PropTypes.string,
  previousLabel: React.PropTypes.string,
  nextLabel: React.PropTypes.string,
  lastLabel: React.PropTypes.string,
  urlForPageNumber: React.PropTypes.func
};

Pagination.defaultProps = {
  pageSize: 10,
  pageSizeOptions: [10, 25, 50, 100, 250],
  page: 1,
  total: 100,
  numberOfPaginators: 10,
  firstLabel: 'first',
  previousLabel: 'prev',
  nextLabel: 'next',
  lastLabel: 'last',
  urlForPageNumber: () => '#'
};

export default Pagination;

