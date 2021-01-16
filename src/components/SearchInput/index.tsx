import React from 'react';
import { Select } from 'antd';
// TODO 不需要后，记得删除 package.json 中的 fetch-jsonp
import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import 'antd/dist/antd.css';

const { Option } = Select;

let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    const str = querystring.encode({
      code: 'utf-8',
      q: value,
    });
    jsonp(`https://suggest.taobao.com/sug?${str}`)
      .then(response => response.json())
      .then(d => {
        console.log(d);
        if (currentValue === value) {
          const { result } = d;
          const data = [];
          result.forEach(r => {
            data.push({
              value: r[0],
              text: r[0],
            });
          });
          callback(data);
        }
      });
  }

  timeout = setTimeout(fake, 300);  // 节流
}

class SearchInput extends React.Component {
  state = {
    // here state contains two separate state:
    // 1. data {Array}
    // 2. value
    data: [],
    value: undefined,
  };

  handleSearch = value => {
    if (value) {
      fetch(value, data => this.setState({ data }));
    } else {
      this.setState({ data: [] });
    }
  };

  // handleChange = value => {
  //   this.setState({ value });
  // };

  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    // console.log(this.props);
    return (
      <Select
        showSearch
        value={this.state.value}
        placeholder="input search text"
        style={{ width: 200 }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        // onChange={this.handleChange}
        // notFoundContent={'notfound'}
      >
        {options}
      </Select>
    );
  }
}

export default SearchInput;