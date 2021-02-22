import React from 'react';
import { message, Select } from 'antd';

import { localSearch } from '@/services/bmap-service';


const { Option } = Select;

type rawPOIDataType = {
  key: React.Key;
  name: string;
  lng: number;  // longitude
  lat: number;  // latitude
}

let timer: number | undefined | null;
let currentValue: string;

// 放 service
function fetchBmapPOI(userInput: string, callback: (formerState: rawPOIDataType[]) => void) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  currentValue = userInput;

  function searchCallbackHandler(results: any) {
    // console.log(results);
    if (currentValue === userInput) {
      const { _pois } = results;
      const rawPOIData: rawPOIDataType[] = [];
      _pois.forEach((item: any) => {
        rawPOIData.push({
          key: item.uid,
          name: item.title,
          lng: item.point.lng,
          lat: item.point.lat,
        });
      });
      console.log(rawPOIData);
      callback(rawPOIData);
    }
  }

  function search() {
    localSearch('北京', userInput, {
      onSearchComplete: searchCallbackHandler,
    });
  }
  timer = setTimeout(search, 100);  // 节流
}


// function fetch1(userInput, callback) {
//   if (timer) {
//     clearTimeout(timer);
//     timer = null;
//   }
//   currentValue = userInput;

//   function fake() {
//     const str = querystring.encode({
//       code: 'utf-8',
//       q: userInput,
//     });
//     jsonp(`https://suggest.taobao.com/sug?${str}`)
//       .then(response => response.json())
//       .then(d => {
//         console.log(d);
//         if (currentValue === userInput) {
//           const { result } = d;
//           const data = [];
//           result.forEach(r => {
//             data.push({
//               userInput: r[0],
//               text: r[0],
//             });
//           });
//           callback(data);
//         }
//       });
//   }
//   timer = setTimeout(fake, 300);  // 节流
// }

class SearchInput extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      // + selected
      remoteData: [],
      userInputValue: undefined,
    };
  }
  

  handleSearch = (userInput: string) => {
    if (userInput) {
      try {
        fetchBmapPOI(userInput, data => this.setState({ remoteData: data }));
      } catch (e) {
        message.error(e.message);
      }
    } else {
      this.setState({ remoteData: [] });
    }
  };

  // handleChange = userInput => {
  //   this.setState({ userInput });
  // };

  render() {
    console.log('state', this.state.remoteData);
    const options = this.state.remoteData.map(
      (item: rawPOIDataType) => {
        return (
          <Option key={item.key} value={item.name}>{item.name}</Option>
        );
      });

    return (
      <Select
        showSearch
        autoFocus
        // value={this.state.userInput}
        placeholder="input search text"
        style={{ width: 200 }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        // onBlur={this.props.save}
        // onChange={this.handleChange}
        // notFoundContent={'notfound'}
      >
        {options}
      </Select>
    );
  }
}

export default SearchInput;