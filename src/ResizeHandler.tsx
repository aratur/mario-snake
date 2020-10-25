import {useEffect, useState, useCallback} from 'react';
import { columns, rows } from './model/ColumnsAndRows';

const ResizeHandler = () => {
  // const [lastChanged, setLastChanged] = useState(Date.now());
  const [timeout, updateTimeout] = useState<NodeJS.Timer | undefined>(undefined);
  const waitFor = 300;
  const rowHeight: number = 25;
  const colWidth: number = 25;
  const statusBarHeight: number = 25;
  const w3margins: number = 50;
  const navigationWidth: number = 230;
  const maxColumns: number = 20;
  const maxRows: number = 20;

  const handleResizeAfterTimeout = useCallback(() => {
    updateTimeout(undefined);
    const height: number = window.innerHeight - statusBarHeight;
    const width: number = window.innerWidth - navigationWidth - w3margins;
    const possibleColumns: number = Math.floor(width/colWidth);
    const possibleRows: number = Math.floor(height/rowHeight);
    console.log(width, height,
       ", R: ",rows.length, possibleRows,
       ", C: " ,columns.length, possibleColumns);
  }, []);

  const handleResizeEvent = useCallback((event: UIEvent) => {
    event.stopPropagation();
    if (typeof timeout !== "undefined") {
      clearTimeout(timeout);
    }
    updateTimeout(setTimeout(handleResizeAfterTimeout, waitFor));
  }, [timeout, handleResizeAfterTimeout]);

  useEffect(() => {
    window.addEventListener("resize", handleResizeEvent);
    return () => {
      window.removeEventListener('resize', handleResizeEvent);
    }
  }, [handleResizeEvent]);
  return null;
}

export default ResizeHandler;
