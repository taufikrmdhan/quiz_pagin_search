import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [datas, setDatas] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [form, setForm] = useState({
    keyword: "",
    filter: "",
  });

  useEffect(() => {
    const onLoadData = async () => {
      setIsLoading(true);
      const getData = await fetch(`https://randomuser.me/api/?results=100`);
      return getData;
    };
    onLoadData()
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.results);
        setDatas(data.results);
        setIsLoading(false);
      });
  }, []);

  const resetFilter = () => {
    setForm({
      ...form,
      keyword: "",
      filter: "",
    });
  };

  const onChangeHandle = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSearchButton = (e) => {
    e.preventDefault();
    const body = {
      keyword: form.keyword,
      filter: form.filter,
    };
    console.log(body);
    const searchResults = [];
    for (let i = 0; i < datas.length; i++) {
      const fullName = datas[i].name.first + " " + datas[i].name.last;

      fullName.toLowerCase();
      // console.log(fullName.toLocaleLowerCase());
      const searchByKeyword = fullName.toLocaleLowerCase().match(body.keyword.toLocaleLowerCase());
      let searchByFilter;
      if(body.filter == "") {
        searchByFilter = true
      } else {
        searchByFilter = datas[i].gender === body.filter;
      }

      console.log(searchByKeyword)
      if (searchByKeyword != null && searchByFilter != false) {
        searchResults.push(datas[i]);
      }
      setDataSearch(searchResults);
    }
    console.log(searchResults.length)
    console.log(dataSearch.length);
  };

  /** paginate */
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  // get current post
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = datas.slice(indexOfFirstPost, indexOfLastPost);

  // pagination navigate
  const totalPost = datas.length;
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPost / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  // change page
  const paginate = (PageNumber) => setCurrentPage(PageNumber);
  /** end of paginate */

  /** paginate search */
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [postsPerPageSearch] = useState(10);

  // get current post
  const indexOfLastPostSearch = currentPageSearch * postsPerPageSearch;
  const indexOfFirstPostSearch = indexOfLastPostSearch - postsPerPageSearch;
  const currentPostSearch = dataSearch.slice(indexOfFirstPostSearch, indexOfLastPostSearch);

  // pagination navigate
  const totalPostSearch = dataSearch.length;
  const pageNumbersSearch = [];
  for (let i = 1; i <= Math.ceil(totalPostSearch / postsPerPageSearch); i++) {
    pageNumbersSearch.push(i);
  }

  // change page
  const paginateSearch = (PageNumberSearch) => setCurrentPageSearch(PageNumberSearch);
  /** end of paginate */
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <div className="wrapper-content m-5">
        <div className="title">
          <p className="h1">Search data and filter</p>
        </div>
        <form
          onSubmit={(e) => onSearchButton(e)}
          className="w-100 d-flex flex-row"
        >
          <div className="input-keyword-wrapper d-flex flex-column">
            <div className="label">
              <label htmlFor="search">Search</label>
            </div>
            <div className="d-flex">
              <input
                type="text"
                id="search"
                name="keyword"
                onChange={onChangeHandle}
              />
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-search-heart-fill"></i>
              </button>
            </div>
          </div>
          <div className="input-keyword-wrapper d-flex flex-column">
            <div className="label">
              <label htmlFor="search">Gender</label>
            </div>
            <div className="d-flex">
              <select
                className="form-select"
                aria-label="Default select example"
                name="filter"
                onChange={onChangeHandle}
              >
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <button
                type="reset"
                onClick={resetFilter}
                className="btn btn-warning"
                style={{ width: "250px" }}
              >
                Reset Filter
              </button>
            </div>
          </div>
        </form>
        <div className="mt-2">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Gender</th>
                <th scope="col">Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {dataSearch.length > 0
                ? currentPostSearch.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.login.username}</td>
                      <td>
                        {item.name.title} {item.name.first} {item.name.last}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.gender}</td>
                      <td>{item.registered.date}</td>
                    </tr>
                  ))
                : currentPost.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.login.username}</td>
                      <td>
                        {item.name.title} {item.name.first} {item.name.last}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.gender}</td>
                      <td>{item.registered.date}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {
            dataSearch.length > 0 ? 
            <>
            <div>
            <ul className="pagination ms-5">
              {pageNumbersSearch.map((number) => (
                <li key={number} className="page-item">
                  <button
                    href="!#"
                    className="btn page-link"
                    onClick={() => paginateSearch(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </div>
            </> 
            : 
            <>
            <div>
            <ul className="pagination ms-5">
              {pageNumbers.map((number) => (
                <li key={number} className="page-item">
                  <button
                    href="!#"
                    className="btn page-link"
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </div>
            </>
          }
          
        </div>
      </div>
    </div>
  );
}

export default App;
