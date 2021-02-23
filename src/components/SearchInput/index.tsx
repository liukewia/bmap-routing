import React from 'react';
import { Select } from 'antd';
import { throttle } from 'lodash';
import { fetchBmapPOI } from '@/services/bmap-service';

import type { RawPOIDataType } from '@/services/bmap-type';
import type { SearchInputProps, SearchInputState } from './data';

const { Option } = Select;



class SearchInput extends React.Component<SearchInputProps, SearchInputState> {
  
  constructor(props: SearchInputProps) {
    super(props);

    const { demand, ...recordWithoutDemand } = this.props.record;

    this.state = {
      pointData: recordWithoutDemand,  // key name lng lat
      searchResult: [],
    };
  }

  handleSearch = (userInput: string): void => {
    if (userInput) {
      try {
        fetchBmapPOI(userInput, searchData => {
          // console.log(searchData);
          // 若节流后的搜索方法带回空数组作为结果（后端未返回或未找到匹配数据会返回[]），则不应更新state，因为此时有可能是由于组件 unmount 导致，若更新state会有内存泄漏
          if (searchData.length > 0) {
            this.setState({searchResult: searchData});
          }
        });
      } catch (errInfo) {
        console.log('Search failed:', errInfo);
      }
    } else {
      this.setState({ searchResult: [] });
    }
  };

  throttledSearch = throttle(this.handleSearch, 1000, {
    leading: false,
    trailing: true,  // 每 1k ms 末尾才 search 1次
  });

  // 当 失焦(blur)时，select组件 unmount，取而代之为普通文本组件。 此情况下若首次被settimeout的查找地点数据方法handle search内的setstate未发生,select组件就被 unmount 了，则 handle search 方法之后的 set state 会不工作(no-op)，同时被节流的后端请求仍可能在进行，带来内存泄漏
  componentWillUnmount() {
    this.throttledSearch.cancel();
  }

  // 不是 user input变触发, 是选中某个 Option 后触发 onchange , option 的名字
  handleChange = (PointName: string, optionProps: any): void => {
    const result = [ ...this.state.searchResult ];
    for (let index = 0; index < result.length; index += 1) {
      const val = result[index];
      if (val.key === optionProps.key) {
        this.setState({ pointData: val });  // 异步
        return;
      }
    }
  }

  handleBlur = async () => {
    await this.props.saveSearchResult(this.state.pointData);
  }

  render() {
    const options = this.state.searchResult.map((item: RawPOIDataType) => <Option key={item.key} value={item.name}>{item.name}</Option>);

    return (
      <Select
        showSearch
        autoFocus
        value={this.state.pointData.name}
        placeholder="input search text"
        style={{ width: 200 }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.throttledSearch}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      >
        {options}
      </Select>
    );
  }
}

export default SearchInput;