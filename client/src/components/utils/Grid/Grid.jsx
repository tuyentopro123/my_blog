
const Grid = (props) => {
    const gapCol = props.gapCol ? {gridColumnGap: `${props.gapCol}px`} : {gridColumnGap: 0}

    const gapRow = props.gapRow ? {
        gridRowGap: `${props.gapRow}px`
    } : {gridRowGap: 0}

    const col = props.col ? `col-${props.col}` : ''
    const col_md = props.md ? `col-md-${props.md}` : ''
    const col_sm = props.sm ? `col-sm-${props.sm}` : ''

    return (
        <div 
            className= {`grid ${col} ${col_md} ${col_sm}`}
            style = {{...gapCol, ...gapRow}}
        >
            {props.children}
        </div>
    )
}

export default Grid

