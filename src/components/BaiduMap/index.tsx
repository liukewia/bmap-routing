import {
  Map,
  Marker,
  NavigationControl,
  // InfoWindow,
  MapApiLoaderHOC,
} from 'react-bmapgl';
import {
  localSearch,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultSearchOption,
} from '@/services/bmap-service';

const BaiduMap = () => {
  const mapClickHandler = async (clickEvent, defaultCity, POI, options) => {
    await localSearch(clickEvent, defaultCity, POI, options);
    // console.log(results);
  };

  return (
    <Map
      center={new BMapGL.Point(116.4, 39.91)}
      zoom={11}
      onClick={(e) =>
        mapClickHandler(e, '北京', '腾讯北京总部大楼', {
          onSearchComplete: (results: any) => {
            console.log(results);
          },
        })
      }
      // enableDragging={true}
      enableScrollWheelZoom={true}
    >
      <Marker position={new BMapGL.Point(116.4, 39.91)} icon="start" />
      <NavigationControl />
    </Map>
  );
};

export default MapApiLoaderHOC({
  ak: 'OalRnqTPhFKA9F4CwPQwCtprspgDqGG3',
})(BaiduMap);
