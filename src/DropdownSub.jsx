 //sub cat dropdown

 function DropdownSub(props) {
    const {

      category,
      categoryForm,
      subCategory,
      setSubCategory

    } = props;

   

      let index = category.findIndex(
        (temp) => temp['name'] == categoryForm)

       
if (category[index].subCategory.length > 0) {
    return (
      <div>

        <label>SubCategory</label>
        <select required value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>

          {category[index].subCategory.map((item, iter) => {
            let menuSub = item.name


            return (
              <option id={iter} key={iter}>{menuSub}</option>

            )
          })}
        </select>


      </div>
    )
  }
 
  }

  export default DropdownSub;
