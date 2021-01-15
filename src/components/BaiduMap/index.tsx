import {
  Map,
  Marker,
  NavigationControl,
  MapApiLoaderHOC,
} from 'react-bmapgl';
import { localSearch } from '@/services/bmap-service';

const BaiduMap = () => {

  const searchResultHandler = (results: any) => {
    // cannot return results, can only handle them inside this scope.
    console.log(results);
  }

  const mapClickHandler = (clickEvent, defaultCity, POI, options) => {
    localSearch(clickEvent, defaultCity, POI, options);
  };

  return (
    <Map
      center={new BMapGL.Point(116.4, 39.91)}
      zoom={11}
      onClick={(e) =>
        mapClickHandler(e, '北京', '腾讯北京总部大楼', {
          onSearchComplete: searchResultHandler,
        })
      }
      // enableDragging={true}
      // enableScrollWheelZoom={true}
    >
      <Marker position={new BMapGL.Point(116.4, 39.91)} icon="start" />
      <NavigationControl />
    </Map>
  );
};

export default MapApiLoaderHOC({ ak: 'OalRnqTPhFKA9F4CwPQwCtprspgDqGG3' })(BaiduMap);
