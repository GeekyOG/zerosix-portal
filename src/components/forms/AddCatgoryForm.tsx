import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import Button from "../../ui/Button";

import { toast } from "react-toastify";
import Input from "../input/Input";
import {
  useAddCategoryMutation,
  useLazyGetCategoryQuery,
  useUpdateCategoryMutation,
} from "../../api/categoryApi";

interface AddCategoryFormProps {
  callBackAction?: () => void;
  reset: boolean;
  id?: string;
}

function AddCategoryForm({ callBackAction, id, reset }: AddCategoryFormProps) {
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [getCategory, { isLoading: isFetching }] = useLazyGetCategoryQuery();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [initialValues, setInitialValues] = React.useState({
    category: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      if (id) {
        const { data, error } = await getCategory(id);
        if (data) {
          setInitialValues({ category: data.name });
        } else if (error) {
          toast.error("Failed to fetch category details.");
        }
      }
    };

    fetchCategory();
  }, [id, getCategory]);

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (id) {
              await updateCategory({
                id,
                body: { name: values.category },
              }).unwrap();
              toast.success("Category updated successfully");
            } else {
              await addCategory({ name: values.category }).unwrap();
              toast.success("Category added successfully");
            }
            resetForm();
            callBackAction && callBackAction();
          } catch (error: any) {
            toast.error(error?.data?.message || "An error occurred");
          }
        }}
      >
        {({ errors, touched, resetForm }) => {
          useEffect(() => {
            if (!reset) {
              resetForm();
            }
          }, [reset, resetForm]);

          return (
            <Form encType="multipart/form-data">
              <Input
                title="Category"
                name="category"
                touched={touched.category}
                errors={errors.category}
                placeholder="Enter category"
                width="h-[36px] w-[100%] rounded-[5px]"
              />
              <Button
                className="mt-[10px]"
                isLoading={isAdding || isUpdating || isFetching}
              >
                {id ? "Update Category" : "Add Category"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default AddCategoryForm;
