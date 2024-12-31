 //dropdown form


 function Dropdown(props) {

    const {

       category,
       setCategoryForm,
       category_id,
       categoryForm
    
      } = props;

    // change cat
  function changeCategory(e) {

    let index = category.findIndex(
      (temp) => temp['name'] == e.target.value)


    category_id.current = category[index]._id
    setCategoryForm(e.target.value)
  }

    return (
      <div>

        <label>Category</label>
        <select required value={categoryForm} onChange={(e) => changeCategory(e)}>

          {category.map((item, iter) => {
            let category = item.name


            return (
              <option id={iter} key={iter}>{category}</option>

            )
          })}
        </select>


      </div>
    )

  }


  export default Dropdown;