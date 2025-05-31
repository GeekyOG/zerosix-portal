import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { cn } from "../../utils/cn";
import Input from "../input/Input";
import { toast } from "react-toastify";

import {
  useAddImageToWorkMutation,
  useAddWorkMutation,
  useLazyGetWorkQuery,
  useUpdateWorkMutation,
} from "../../api/imageApi";
import { useGetCategoriesQuery } from "../../api/categoryApi";

interface AddImageFormProps {
  reset: boolean;
  callBackAction?: () => void;
  id?: string;
}

const AddImageForm: React.FC<AddImageFormProps> = ({
  reset,
  callBackAction,
  id,
}) => {
  const [, setImageError] = useState("");
  const [image, setImage] = useState<any>("");

  const { isFetching, data: categories } = useGetCategoriesQuery("");

  const [getPortfolio, { data, isLoading: featuredLoading }] =
    useLazyGetWorkQuery();

  const [updatePortfolio, { isLoading: updateLoading }] =
    useUpdateWorkMutation();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");

  const [addWork, { isLoading: workLoading }] = useAddWorkMutation();
  const [addImageToWork, { isLoading: addImageToWorkLoading }] =
    useAddImageToWorkMutation();

  useEffect(() => {
    if (id) {
      getPortfolio(id);
    }
  }, [id]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  return (
    <div>
      {featuredLoading && id ? (
        <img
          src="/dark-spinner.svg"
          alt=""
          className={cn("h-[30px] w-[30px] mx-auto mt-[100px]")}
        />
      ) : (
        <Formik
          initialValues={{
            title: data?.name || "",
            category: data?.category || "",
            position: data?.position || "",
          }}
          enableReinitialize
          onSubmit={async (values, { resetForm }) => {
            if (id) {
              // Edit mode
              updatePortfolio({
                id,
                body: {
                  name: values.title,
                  category: values.category,
                  position: values.position,
                },
              })
                .unwrap()
                .then(() => {
                  toast.success("Work updated successfully");
                  if (callBackAction) callBackAction();
                })
                .catch((err) => {
                  toast.error(err.message ?? "Something went wrong");
                });
            } else {
              // Add mode
              if (selectedFiles?.length === 0) {
                setMessage("Please select some images to upload.");
                return;
              }

              addWork({
                name: values.title,
                category: values.category,
              })
                .unwrap()
                .then(async (work) => {
                  await Promise.all(
                    Array.from(selectedFiles).map((file) => {
                      const formData = new FormData();
                      formData.append("category", values.category);
                      formData.append("id", work.id);
                      formData.append("image", file);
                      formData.append("position", values.position);
                      formData.append("name", values.title);

                      return addImageToWork({ body: formData, id: work.id });
                    })
                  );

                  getPortfolio("");
                  resetForm();
                  setSelectedFiles([]);
                  setMessage("");
                  toast.success("Work created successfully");
                })
                .catch((err) => {
                  toast.error(err.message ?? "Image upload failed");
                });
            }
          }}
        >
          {({ errors, touched, resetForm, values, setFieldValue }) => {
            useEffect(() => {
              if (data && reset) {
                resetForm({
                  values: {
                    title: data.name || "",
                    category: data.category || "",
                    position: data.position || "",
                  },
                });
              }

              if (!reset) {
                resetForm();
                setImage("");
                setImageError("");
              }
            }, [reset, data]);

            return (
              <Form
                encType="multipart/form-data"
                className="flex flex-col gap-3"
              >
                <Input
                  title="Title"
                  name="title"
                  touched={touched.title}
                  errors={errors.title}
                  placeholder="Enter title"
                  width="h-[36px] w-[100%] rounded-[5px]"
                />

                <p>Category</p>
                <select
                  name="category"
                  required
                  className="border-[1px] px-[10px] py-[10px] outline-0"
                  onChange={(e) => setFieldValue("category", e.target.value)}
                  value={values.category}
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {!id && (
                  <>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {message && <p className="text-red-500">{message}</p>}
                  </>
                )}

                <Input
                  title="Position"
                  name="position"
                  touched={touched.position}
                  errors={errors.position}
                  placeholder="Enter position"
                  width="h-[36px] w-[100%] rounded-[5px]"
                />

                <Button
                  isLoading={
                    workLoading || addImageToWorkLoading || updateLoading
                  }
                >
                  {id ? "Update Work" : "Add Image"}
                </Button>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default AddImageForm;
