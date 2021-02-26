import React from 'react';
import type { ReactText } from 'react';
import { Cascader } from 'antd';

import cityData from './cityData';

type CitySelectorProps = {
  priorSearchCity: { arr: ReactText[] };
  handleDefaultCity: (newCity: ReactText[]) => void;
}

export default class CitySelector extends React.Component<CitySelectorProps, any> {

  onChange = (newCityArr: ReactText[]) => {
    this.props.handleDefaultCity(newCityArr);
  }

  render() {
    return (
      <Cascader
        allowClear={false}
        defaultValue={this.props.priorSearchCity.arr}
        options={cityData}
        expandTrigger="hover"
        placeholder="选择优先搜索地区"
        onChange={this.onChange}
        style={{ width: 200 }}
      />
    )
  }
}
