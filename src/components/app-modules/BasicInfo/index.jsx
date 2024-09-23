"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import {
  TextInput,
  Textarea,
  Button,
  Box,
  Flex,
  FileButton,
  Group,
  Select,
  Grid,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FcAcceptDatabase, FcAddImage } from "react-icons/fc";
import Image from "next/image";
import Breadcrumb from "@/components/utils/Breadcrumb";
import compmanyLogo from "public/full_logo.png";
import { countries } from "@/data/countries";
import { getData } from "@/lib/fetch";
import { update, submit } from "@/lib/submit";
import { fetcher } from "@/lib/fetch";
import { formatDate, getStoragePath } from "@/lib/helper";
import {
  validateEmail,
  validatePhoneNumber,
  validateWebsite,
} from "@/lib/validate";
import { BsDatabaseExclamation } from "react-icons/bs";

const BasicInfo = () => {
  const [basicInfo, setBasicInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldChange, setShouldChange] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingError, setIsFetchingError] = useState(false);

  useEffect(() => {
    if (shouldChange) {
      const fetchBasicInfo = async () => {
        try {
          const response = await getData(`/api/company/get-basicinformation/`);
          // console.log(response);
          setBasicInfo(response?.data?.data?.result[0]);
          setTimeout(() => {
            setIsFetching(false);
          }, 500);
        } catch (error) {
          setTimeout(() => {
            setIsFetching(false);
            setIsFetchingError(true);
          }, 500);
          console.error("Failed to fetch basic information:", error);
        }
      };
      fetchBasicInfo();
      setShouldChange(false);
    }
  }, [shouldChange]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      establishment_date: null,
      business_registration_number: "",
      tax_id_number: null,
      bin_no: null,
      description: "",
      website_url: null,
      primary_email: null,
      primary_phone_number: null,
      fax: null,
      logo: null,
      industry_type: "",
      // industry_type: {
      //   id: "",
      //   name: "",
      // },
      address: {
        city: "",
        state_division: "",
        post_zip_code: "",
        country: "",
        address: "",
      },
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
      primary_email: (value) =>
        value && !validateEmail(value) ? "Invalid email" : null,
      primary_phone_number: (value) =>
        value && !validatePhoneNumber(value) ? "Invalid phone number" : null,
      website_url: (value) =>
        value && !validateWebsite(value) ? "Invalid website URL" : null,
    },
  });

  // const {
  //   data,
  //   error,
  //   isLoading: isFetchLoading,
  // } = useSWR(`/api/company/get-companytype/`, fetcher, {
  //   errorRetryCount: 2,
  //   keepPreviousData: true,
  // });

  // const company_types = data?.result?.map((item) => ({
  //   label: item?.name?.toString() || "",
  //   value: String(item?.id || ""),
  // }));

  // const company_types = [
  //   {
  //     label: "IT",
  //     value: "1",
  //   },
  //   {
  //     label: "sdfg",
  //     value: "2",
  //   },
  // ];

  // console.log(company_types);

  useEffect(() => {
    if (basicInfo) {
      form.setValues({
        // ...basicInfo,
        // establishment_date: new Date(basicInfo.establishment_date),

        name: basicInfo.name ?? "",
        establishment_date: basicInfo.establishment_date
          ? new Date(basicInfo.establishment_date)
          : null,
        business_registration_number:
          basicInfo.business_registration_number ?? "",
        tax_id_number: basicInfo.tax_id_number ?? "",
        bin_no: basicInfo.bin_no ?? "",
        description: basicInfo.description ?? "",
        website_url: basicInfo.website_url ?? "",
        primary_email: basicInfo.primary_email ?? "",
        primary_phone_number: basicInfo.primary_phone_number ?? "",
        fax: basicInfo.fax ?? "",
        logo: basicInfo.logo ?? "",
        industry_type: basicInfo.industry_type ?? "",
        // If industry_type is an object, you can do something like this:
        // industry_type: {
        //   id: basicInfo.industry_type?.id ?? "",
        //   name: basicInfo.industry_type?.name ?? "",
        // },
        address: {
          city: basicInfo.address?.city ?? "",
          state_division: basicInfo.address?.state_division ?? "",
          post_zip_code: basicInfo.address?.post_zip_code ?? "",
          country: basicInfo.address?.country ?? "",
          address: basicInfo.address?.address ?? "",
        },
      });
    }
  }, [basicInfo]);

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (values) => {
    const establishmentDate = values.establishment_date;
    const formattedDate =
      establishmentDate instanceof Date && !isNaN(establishmentDate)
        ? establishmentDate.toISOString().split("T")[0]
        : null;

    // const formattedDate = values?.establishment_date
    //   ? values.establishment_date.toISOString().split("T")[0]
    //   : null;

    setIsSubmitting(true);

    const transformedValues = {
      ...values,
      establishment_date: formattedDate,
      // industry_type: values.industry_type.id,
    };

    // Remove the industry_type field completely
    // const { industry_type, ...transformedValues } = values; // temporary

    try {
      const formValues = new FormData();

      const flattenObject = (obj, prefix = "") => {
        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          const formKey = prefix ? `${prefix}[${key}]` : key;

          if (value && typeof value === "object" && !(value instanceof File)) {
            flattenObject(value, formKey);
          } else {
            formValues.append(formKey, value);
          }
        });
      };

      flattenObject(transformedValues);

      // return;

      const method = basicInfo ? "PUT" : "POST";
      const endpoint = basicInfo
        ? `/api/company/update-basicinformation/${basicInfo.id}`
        : `/api/company/add-company/`;

      const response = basicInfo
        ? await update(endpoint, formValues, true)
        : await submit(endpoint, formValues, true);

      // console.log(response);

      if (response?.status === "success") {
        setTimeout(() => {
          setBasicInfo((prev) => ({ ...prev, ...response?.data }));
          setIsSubmitting(false);
          // setShouldChange(true);
          setIsEditing(false);
          setPreview(null);
          notifications.show({
            withCloseButton: true,
            autoClose: 5000,
            title: "Success!",
            message: "Company information updated successfully.",
            color: "green",
            // icon: <></>,
            className: "my-notification-class",
            // style: { backgroundColor: "red" },
            loading: false,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setIsSubmitting(false);
          notifications.show({
            withCloseButton: true,
            autoClose: 5000,
            title: "Error!",
            message: "Something went wrong!",
            color: "red",
            // icon: <></>,
            className: "my-notification-class",
            // style: { backgroundColor: "red" },
            loading: false,
          });
        }, 500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setTimeout(() => {
        setIsSubmitting(false);
        notifications.show({
          withCloseButton: true,
          autoClose: 5000,
          title: "Error!",
          message: "Something went wrong!",
          color: "red",
          // icon: <></>,
          className: "my-notification-class",
          // style: { backgroundColor: "red" },
          loading: false,
        });
      }, 500);
    }
  };

  const handleCancel = async () => {
    form.setValues({
      ...basicInfo,
      establishment_date: new Date(basicInfo.establishment_date),
    });
    setIsEditing(false);
    setPreview(null);
  };

  const handleFileChange = (file) => {
    setPreview(URL.createObjectURL(file));
    form.setFieldValue("logo", file); // add this line
  };

  const handleClearLogo = () => {
    setPreview(null);
    form.setFieldValue("logo", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  if (isFetching || isFetchingError) {
    return (
      <>
        <Breadcrumb
          classNames={{
            root: "mb-4",
          }}
          title="Basic Info"
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Basic Info" },
          ]}
        />

        <div
          className="itemCard d-flex justify-content-center align-items-center"
          style={{ height: "580px" }}
        >
          {isFetching && "Loading..."}
          {isFetchingError && <span className="text-danger"></span>}
        </div>
      </>
    );
  }

  if (!basicInfo && !isEditing) {
    return (
      <>
        <Breadcrumb
          classNames={{
            root: "mb-4",
          }}
          title="Basic Info"
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Basic Info" },
          ]}
        />

        <div className="itemCard">
          <div className="dataBox">
            <p className="dataBoxIcon">
              <BsDatabaseExclamation />
            </p>
            <Button
              variant="filled"
              size="md"
              onClick={() => setIsEditing(true)}
            >
              Add Company Information
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        classNames={{
          root: "mb-4",
        }}
        title="Basic Info"
        items={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Basic Info" },
        ]}
      />

      {!isEditing ? (
        <div className="itemCard">
          <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
            <Grid.Col span={6}>
              <div className="compmanyLogo">
                <Image
                  src={
                    basicInfo?.logo
                      ? getStoragePath(basicInfo?.logo)
                      : compmanyLogo
                  }
                  alt="Company Logo"
                  width="80"
                  height="40"
                />
              </div>
            </Grid.Col>
            <Grid.Col span={6}>
              <Flex
                gap="md"
                justify="flex-end"
                align="flex-start"
                direction="row"
                wrap="wrap"
              >
                <Button
                  variant="filled"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </Flex>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 3 }}>
              <div className="infoText">
                <p className="color-light font_14 mb-1">Name</p>
                <p className="font_18">
                  {basicInfo?.name}
                  {/* API Solutions Ltd. */}
                </p>
              </div>
              {/* <div className="infoText">
                <p className="color-light font_14 mb-1">Legal Name</p>
                <p className="font_18">{basicInfo?.legal_name}</p>
              </div> */}
              <div className="infoText">
                <p className="color-light font_14 mb-1">Industry</p>
                <p className="font_18">
                  {/* {basicInfo?.industry_type?.name} */}
                  {basicInfo?.industry_type || "N/A"}
                  {/* API Solutions Ltd. */}
                </p>
              </div>
              <div className="infoText">
                <p className="color-light font_14 mb-1">Establishment Date</p>
                <p className="font_18">
                  {formatDate(basicInfo?.establishment_date)}
                </p>
              </div>
              <div className="infoText">
                <p className="color-light font_14 mb-1">
                  Business Registration No
                </p>
                <p className="font_18">
                  {basicInfo?.business_registration_number}
                  {/* 3875387658 */}
                </p>
              </div>
              <div className="infoText">
                <p className="color-light font_14 mb-1">Description</p>
                <p className="font_18">
                  {basicInfo?.description || "NA"}
                  {/* 3875387658 */}
                </p>
              </div>
              <div className="infoText">
                <p className="color-light font_14 mb-1">bin_no</p>
                <p className="font_18">
                  {basicInfo?.bin_no || "NA"}
                  {/* 3875387658 */}
                </p>
              </div>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 3 }}>
              <div className="infoText">
                <p className="color-light font_14 mb-1">Tax ID Number</p>
                <p className="font_18">{basicInfo?.tax_id_number}</p>
              </div>
              <div className="infoText">
                <p className="color-light font_14 mb-1">Phone</p>
                <p className="font_18">
                  {basicInfo?.primary_phone_number}
                  {/* +880 1686449007 */}
                </p>
              </div>
              <div className="infoText">
                <p className="color-light font_14 mb-1">Fax</p>
                <p className="font_18">
                  {basicInfo?.fax}
                  {/* +88-02 55035911 */}
                </p>
              </div>

              <div className="infoText">
                <p className="color-light font_14 mb-1">Email</p>
                <p className="font_18">
                  {basicInfo?.primary_email}
                  {/* hello@apisolutionsltd.com */}
                </p>
              </div>
              <div className="infoText">
                <p className="color-light font_14 mb-1">Website</p>
                <p className="font_18">{basicInfo?.website_url}</p>
              </div>
              <div className="infoText">
                <p className="color-light font_14 mb-1">Address</p>
                <p className="font_18">
                  {basicInfo?.address?.address
                    ? `${basicInfo.address.address}`
                    : ""}
                  {basicInfo?.address?.city
                    ? `, ${basicInfo.address.city}`
                    : ""}
                  {basicInfo?.address?.state_division
                    ? `, ${basicInfo.address.state_division}`
                    : ""}
                  {basicInfo?.address?.post_zip_code
                    ? ` - ${basicInfo.address.post_zip_code}`
                    : ""}
                  {basicInfo?.address?.country
                    ? `, ${basicInfo.address.country}`
                    : ""}

                  {/* House -4, Road 23/A, Block B, Banani Dhaka 1213, Bangladesh */}
                </p>
              </div>
            </Grid.Col>
          </Grid>
        </div>
      ) : (
        <div className="itemCard">
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
              <Grid.Col
                span={{ base: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
                order={{ base: 2, sm: 1 }}
              >
                <Box>
                  <TextInput
                    label="Name"
                    placeholder="Name"
                    {...form.getInputProps("name")}
                    disabled={isSubmitting}
                    required
                  />
                  <DateInput
                    mt="sm"
                    label="Establishment Date"
                    placeholder="Establishment Date"
                    {...form.getInputProps("establishment_date")}
                    disabled={isSubmitting}
                    required
                  />

                  <TextInput
                    mt="sm"
                    label="Industry"
                    placeholder="Industry"
                    {...form.getInputProps("industry_type")}
                    disabled={isSubmitting}
                  />
                  <TextInput
                    mt="sm"
                    label="Business Registration No"
                    placeholder="Business Registration No"
                    {...form.getInputProps("business_registration_number")}
                    disabled={isSubmitting}
                  />

                  <TextInput
                    mt="sm"
                    label="TAX ID"
                    placeholder="TAX ID"
                    {...form.getInputProps("tax_id_number")}
                    disabled={isSubmitting}
                  />

                  <TextInput
                    mt="sm"
                    label="BIN"
                    placeholder="BIN"
                    {...form.getInputProps("bin_no")}
                    disabled={isSubmitting}
                  />

                  <TextInput
                    mt="sm"
                    label="Description"
                    placeholder="Description"
                    {...form.getInputProps("description")}
                    disabled={isSubmitting}
                  />

                  <TextInput
                    mt="sm"
                    label="Website"
                    placeholder="Website"
                    {...form.getInputProps("website_url")}
                    disabled={isSubmitting}
                  />
                </Box>
              </Grid.Col>
              <Grid.Col
                span={{ base: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
                order={{ base: 3, sm: 2 }}
              >
                <Box>
                  <TextInput
                    // mt="sm"
                    label="Email"
                    placeholder="Email"
                    {...form.getInputProps("primary_email")}
                    disabled={isSubmitting}
                    required
                  />

                  <TextInput
                    mt="sm"
                    label="Phone"
                    placeholder="Phone"
                    {...form.getInputProps("primary_phone_number")}
                    disabled={isSubmitting}
                    required
                  />
                  <TextInput
                    mt="sm"
                    label="Fax"
                    placeholder="Fax"
                    {...form.getInputProps("fax")}
                    disabled={isSubmitting}
                  />
                  <TextInput
                    classNames={{
                      root: "w-100",
                    }}
                    mt="sm"
                    label="Address"
                    placeholder="Address"
                    {...form.getInputProps("address.address")}
                    disabled={isSubmitting}
                    required
                  />

                  <TextInput
                    classNames={{
                      root: "w-100",
                    }}
                    mt="sm"
                    label="City"
                    placeholder="City"
                    {...form.getInputProps("address.city")}
                    disabled={isSubmitting}
                    required
                  />

                  <TextInput
                    classNames={{
                      root: "w-100",
                    }}
                    mt="sm"
                    label="Division / State"
                    placeholder="Division / State"
                    {...form.getInputProps(`address.state_division`)}
                    disabled={isSubmitting}
                    required
                  />

                  <TextInput
                    classNames={{
                      root: "w-100",
                    }}
                    mt="sm"
                    label="Postal / ZIP Code"
                    placeholder="Postal / ZIP Code"
                    {...form.getInputProps(`address.post_zip_code`)}
                    disabled={isSubmitting}
                    required
                  />

                  <Select
                    classNames={{
                      root: "w-100",
                    }}
                    mt="sm"
                    label="Country"
                    placeholder="Country"
                    searchable
                    data={countries}
                    {...form.getInputProps("address.country")}
                    disabled={isSubmitting}
                    required
                  />
                </Box>
              </Grid.Col>
              <Grid.Col
                span={{ base: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
                order={{ base: 1, sm: 3 }}
              >
                <div className="uploadBox">
                  {basicInfo?.logo || preview !== null ? (
                    <div
                      className="updatedImage text-center"
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <Image
                        src={
                          preview ? preview : getStoragePath(basicInfo?.logo)
                        }
                        alt="Preview"
                        width={200}
                        height={200}
                      />
                      {preview ? (
                        <button
                          type="button"
                          onClick={handleClearLogo}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                          }}
                        >
                          X
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    <p className="uploadIcon">
                      <FcAddImage />
                    </p>
                  )}
                  <h6 className="mb-4 color-light">
                    NOTE : Supported formats are JPG, JPEG, PNG
                  </h6>

                  <Group justify="center">
                    <FileButton
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg"
                      disabled={isSubmitting}
                    >
                      {(props) => <Button {...props}>Upload Logo</Button>}
                    </FileButton>
                  </Group>
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12 }} order={{ base: 4, sm: 4 }}>
                <div className="submitBtns">
                  <Button
                    type="button"
                    me={"lg"}
                    size="sm"
                    variant="outline"
                    // ml="sm"
                    onClick={() => handleCancel()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    loading={isSubmitting}
                    loaderProps={{ type: "dots" }}
                  >
                    Submit
                  </Button>
                </div>
              </Grid.Col>
            </Grid>
            {/* <Grid>
              <Grid.Col span={3} order={{ base: 2, sm: 1, lg: 3 }}>
                2
              </Grid.Col>
              <Grid.Col span={3} order={{ base: 3, sm: 2, lg: 2 }}>
                3
              </Grid.Col>
              <Grid.Col span={3} order={{ base: 3, sm: 3, lg: 1 }}>
                1
              </Grid.Col>
            </Grid> */}
          </form>
        </div>
      )}
    </>
  );
};

export default BasicInfo;
