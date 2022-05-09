import "./tagItem.scss";

function TagItem(props){
    return(
        <div className="tagItem">
            {props.tag}
        </div>
    );
}
export default TagItem;