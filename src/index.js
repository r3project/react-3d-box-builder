import React, { useState } from 'react';
import styles from './styles.module.css';

export const React3dBoxBuilder = ({ xxx }) => {
  const downloadAnchorReference = React.createRef();

  const [floorElementWidth, setFloorElementWidth] = useState(100);
  const [floorSizes, setFloorSizes] = useState({
    x: 30,
    y: 15
  });

  const [pressedKeys, setPressedKeys] = useState({
    control: false,
    shift: false
  });
  
  const [mouseOnFloor, setMouseOnFloor] = useState(false);
  const [objectData, setObjectData] = useState([]);
  const [hideGhostCube, setHideGhostCube] = useState(false);
  
  const [cameraMap, setCameraMap] = useState({
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    translateX: 0,
    translateY: 0,
    translateZ: -1200,
    scale: 1
  });
  
  const [mouseCurrentPosition, setMouseCurrentPosition] = useState({
    x: 0,
    y: 0,
  });

  const floorAreaDynamicStyles = {
    minWidth: `${floorSizes.x * floorElementWidth}px`,
    minHeight: `${floorSizes.y * floorElementWidth}px`,
    transform: `rotateX(${cameraMap.rotateX}deg) rotateY(${cameraMap.rotateY}deg) scale(${cameraMap.scale}) translateX(${cameraMap.translateX}%) translateY(${cameraMap.translateY}%) rotate(${cameraMap.rotate}deg) translateZ(${cameraMap.translateZ}px)`,
    cursor: `crosshair`
  };

  const getCurrentFloorPosition = (offsetX, offsetY, basedOnFloorAndNewObject = false) => {
    let newValues;
    if (basedOnFloorAndNewObject) {
      newValues = {
        x: offsetX > 0 ? (offsetX <= ((floorSizes.x * floorElementWidth) - floorElementWidth) ? offsetX : ((floorSizes.x * floorElementWidth) - floorElementWidth)) : 0,
        y: offsetY > 0 ? (offsetY <= ((floorSizes.y * floorElementWidth) - floorElementWidth) ? offsetY : ((floorSizes.y * floorElementWidth) - floorElementWidth)) : 0,
      };
    } else {
      newValues = {
        x: offsetX > 0 ? (offsetX <= floorSizes.x * floorElementWidth ? offsetX : floorSizes.x * floorElementWidth) : 0,
        y: offsetY > 0 ? (offsetY <= floorSizes.y * floorElementWidth ? offsetY : floorSizes.y * floorElementWidth) : 0,
      };
    }

    const occupiedElements = objectData.map((element) => {
      return {
        fromX: element.x,
        fromY: element.y,
        toX: element.x + floorElementWidth,
        toY: element.y + floorElementWidth,
        fromZ: element.z,
        toZ: element.z + floorElementWidth
      }
    })

    var occupiedElementFound = null;
    occupiedElements.forEach(element => {
      for (let iteratorX = 1; iteratorX < floorElementWidth; iteratorX++) {
        for (let iteratorY = 1; iteratorY < floorElementWidth; iteratorY++) {
          if (
            element.fromX <= (newValues.x+iteratorX) && element.toX >= (newValues.x+iteratorX)
            && element.fromY <= (newValues.y+iteratorY) && element.toY >= (newValues.y+iteratorY)
            && element.fromZ === 0
          ) {
            occupiedElementFound = element;
            return;
          }
        }
      }
    });

    if (!occupiedElementFound) {
      return newValues;
    }
  };

  const onMouseMoveHandler = (event) => {
    if (!mouseOnFloor) {
      setMouseOnFloor(true);
    }
    const newPositions = getCurrentFloorPosition(event.nativeEvent.offsetX, event.nativeEvent.offsetY, true);
    if (newPositions) {
      setMouseCurrentPosition(
        newPositions
      );
      setHideGhostCube(false);
    } else {
      setHideGhostCube(true);
    }
  };

  const onMouseDownHandler = (event) => {
    const correctPosition = getCurrentFloorPosition(event.nativeEvent.offsetX, event.nativeEvent.offsetY, true);
    
    if (!correctPosition) {
      return;
    }

    const positionX = correctPosition.x;
    const positionY = correctPosition.y;
    
    if (!pressedKeys?.control) {
      // elementMouseDownHandler(
      //   positionX,
      //   positionY,
      //   0,
      //   "walk_platform",
      //   10,
      //   10,
      //   1,
      //   event
      // );
    }
  };


  return (
    <React.Fragment>
      
      <a download={'empty'} ref={downloadAnchorReference} style={{display: 'none'}} href={`empty.json`}>download</a>
      
      <div className={styles.boxPanel} onContextMenu={(event) => event.preventDefault()}>
        <div className={styles.boxPanel__content}>
          <div className={styles.boxPanel__contentContainer}>
            <div
              className={styles.floorArea}
              style={floorAreaDynamicStyles}
              onMouseMove={(event) => {
                onMouseMoveHandler(event);
              }}
              onMouseEnter={(event) => {
                setMouseOnFloor(true);
              }}
              onMouseLeave={() => {
                setMouseOnFloor(false);
              }}
              onMouseDown={(event) => {
                onMouseDownHandler(event);
              }}
            >
              <div 
                className={`${styles.floorXLine}${mouseOnFloor && !pressedKeys.active ? ` ${styles['floorXLine--show']}` : ''}`}
                data-x-position={`X: ${mouseCurrentPosition.x} cm`} style={{
                '--x-position': `${mouseCurrentPosition.x}px`,
                minWidth: `${floorSizes.x * floorElementWidth}px`,
                minHeight: `2px`,
                top: '-4px',
                left: '-4px',
                borderLeft: `4px solid #cfcfcf`
              }}></div>
              <div 
                className={`${styles.floorYLine}${mouseOnFloor && !pressedKeys.active ? ` ${styles['floorYLine--show']}` : ''}`}
                data-y-position={`Y: ${mouseCurrentPosition.y} cm`} style={{
                '--y-position': `${mouseCurrentPosition.y}px`,
                minWidth: `2px`,
                minHeight: `${floorSizes.y * floorElementWidth}px`,
                left: '-4px',
                top: '-4px',
                borderTop: `4px solid #cfcfcf`
              }}></div>
            
              {/* <div
                className={classnames({
                  ghost_hover: true,
                  "ghost_hover--show":
                    mouseOnFloor && !pressedKeys.active &&
                    !hideGhostCube &&
                    activeView === "create" &&
                    !pressedKeys.active,
                  walk_platform: elementType === "walk_platform",
                  cube: elementType === "cube",
                  'mini-cube': elementType === "mini-cube",
                })}
                style={{
                  left: `${mouseCurrentPosition.x}px`,
                  top: `${mouseCurrentPosition.y}px`,
                  width: `${floorElementWidth}px`,
                  height: `${floorElementWidth}px`,
                  transform: `translateZ(${floorElementWidth * 0}px)`,
                }}
                data-current-position={`x: ${mouseCurrentPosition.x} cm, \ny: ${mouseCurrentPosition.y} cm \nw: ${floorElementWidth} cm \nh: ${floorElementWidth} cm \nz: ${floorElementWidth} cm`}
              ></div> */}
            </div>
          </div>
        </div>
      </div>
    
    </React.Fragment>
  );
};