import styled from "styled-components";
import { Toggle } from "../../components/Toggle";
import {
  useDeleteCate,
  useDeleteSub,
  useGetAllCategories,
  usePostCategories,
  usePostSub,
  useUpdateCate,
  useUpdateSub,
} from "../../hooks/adminApi";
import { useCallback, useEffect, useState } from "react";
import { ICategoryAndSub } from "./data";
import { IDropItem } from "../../components/Toggle/data";
import { AdminImage } from "../../components/AdminImage";
import { TextField } from "../../components/TextField";
import { Dropdown, IOption } from "../../components/Dropdown";
import { uploadFile } from "../../hooks/fileApi";

export const AdminCategory = () => {
  const [getAllCategoryReq, getAllCategoryRes] = useGetAllCategories();
  const [categories, setCategories] = useState<ICategoryAndSub[]>([]);
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [categoryFile, setCategoryFile] = useState<File | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [subImage, setSubImage] = useState<string | null>(null);
  const [subFile, setSubFile] = useState<File | null>(null);
  const [subName, setSubName] = useState("");
  const [options, setOptions] = useState<IOption[]>([]);
  const [activeOption, setActiveOption] = useState<IOption>();
  const [postCateReq, postCateRes] = usePostCategories();
  const [postSubReq, postSubRes] = usePostSub();
  const [cateModify, setCateModify] = useState(false);
  const [subModify, setSubModify] = useState(false);
  const [activeCateId, setActiveCateId] = useState(0);
  const [activeSubId, setActiveSubId] = useState(0);
  const [updateCateReq, updateCateRes] = useUpdateCate();
  const [deleteCateReq, deleteCateRes] = useDeleteCate();
  const [updateSubReq, updateSubRes] = useUpdateSub();
  const [deleteSubReq, deleteSubRes] = useDeleteSub();

  useEffect(() => {
    getAllCategoryReq();
  }, []);

  useEffect(() => {
    if (getAllCategoryRes.data && getAllCategoryRes.called) {
      setCategories(getAllCategoryRes.data.data);
      setOptions(
        getAllCategoryRes.data.data.map((el: any) => {
          return { id: el.id, label: el.name };
        })
      );
    }
  }, [getAllCategoryRes]);

  const handleCateSubmit = useCallback(async () => {
    const result = await uploadFile(categoryFile);

    if (result) {
      const imageUrl =
        "https://connect-images1.s3.ap-northeast-2.amazonaws.com/" + result;

      postCateReq(categoryName, imageUrl);
    }
  }, [categoryFile, categoryName, postCateReq]);

  useEffect(() => {
    if (postCateRes.called && postCateRes.data) {
      alert("카테고리가 등록되었습니다.");
      window.location.reload();
    }
  }, [postCateRes]);

  const handleSubSubmit = useCallback(async () => {
    if (!activeOption?.id) {
      alert("상위 카테고리를 선택해주세요");
      return;
    }

    const result = await uploadFile(subFile);

    if (result) {
      const imageUrl =
        "https://connect-images1.s3.ap-northeast-2.amazonaws.com/" + result;

      postSubReq(subName, imageUrl, activeOption?.id);
    }
  }, [subFile, subName, postSubReq, activeOption]);

  useEffect(() => {
    if (postSubRes.called && postSubRes.data) {
      alert("하위 카테고리가 등록되었습니다.");
      window.location.reload();
    }
  }, [postSubRes]);

  const handleCateClick = useCallback(
    (id: number) => {
      const category = categories.filter((el) => el.id === id)[0];

      if (activeCateId !== id && cateModify) {
        setActiveCateId(id);
        setCategoryImage(category.imageUrl);
        setCategoryName(category.name);
        return;
      }
      if (!cateModify) {
        setCategoryImage(category.imageUrl);
        setCategoryName(category.name);
        setActiveCateId(id);
      } else {
        setCategoryImage(null);
        setCategoryName("");
        setActiveCateId(0);
      }

      setCateModify(!cateModify);
    },
    [activeCateId, cateModify, categories]
  );

  const handleSubClick = useCallback(
    (categoryId: number, id: number) => {
      const category = categories.filter((el) => el.id === categoryId)[0];
      const subCate = category.subCategories.filter((el) => el.id === id)[0];

      if (id !== activeSubId && subModify) {
        setActiveCateId(categoryId);
        setActiveSubId(id);

        setCategoryImage(category.imageUrl);
        setCategoryName(category.name);

        setSubImage(subCate.imageUrl);
        setSubName(subCate.name);

        setActiveOption({
          id: categories
            .map((el: any) => {
              return { id: el.id, label: el.name };
            })
            .filter((el) => el.id === categoryId)[0].id,
          label: categories
            .map((el: any) => {
              return { id: el.id, label: el.name };
            })
            .filter((el) => el.id === categoryId)[0].label,
        });
        return;
      }

      if (!subModify) {
        setActiveCateId(categoryId);
        setActiveSubId(id);

        setCategoryImage(category.imageUrl);
        setCategoryName(category.name);

        setSubImage(subCate.imageUrl);
        setSubName(subCate.name);

        setActiveOption({
          id: categories
            .map((el: any) => {
              return { id: el.id, label: el.name };
            })
            .filter((el) => el.id === categoryId)[0].id,
          label: categories
            .map((el: any) => {
              return { id: el.id, label: el.name };
            })
            .filter((el) => el.id === categoryId)[0].label,
        });
      } else {
        setSubImage(null);
        setSubName("");
        setActiveOption(undefined);
        setCategoryImage(null);
        setCategoryName("");
        setActiveCateId(0);
        setActiveSubId(0);
      }

      setCateModify(!cateModify);
      setSubModify(!subModify);
    },
    [categories, activeSubId, subModify, cateModify]
  );

  const handleUpdateCate = useCallback(async () => {
    if (categoryFile) {
      const result = await uploadFile(categoryFile);

      if (result) {
        const imageUrl =
          "https://connect-images1.s3.ap-northeast-2.amazonaws.com/" + result;

        updateCateReq(activeCateId, categoryName, imageUrl);
      }
    } else {
      updateCateReq(activeCateId, categoryName, null);
    }
  }, [activeCateId, categoryFile, categoryName, updateCateReq]);

  useEffect(() => {
    if (updateCateRes.data && updateCateRes.called) {
      alert("카테고리가 수정되었습니다.");
      window.location.reload();
    }
  }, [updateCateRes]);

  const handleDeleteCate = useCallback(() => {
    if (
      // eslint-disable-next-line no-restricted-globals
      confirm("카테고리를 삭제하시겠습니까? 하위 카테고리도 함께 삭제됩니다.")
    ) {
      deleteCateReq(activeCateId);
    }
  }, [activeCateId, deleteCateReq]);

  useEffect(() => {
    if (deleteCateRes.called && !deleteCateRes.error) {
      alert("삭제되었습니다.");
      window.location.reload();
    }
  }, [deleteCateRes]);

  const handleUpdateSub = useCallback(async () => {
    if (subFile) {
      const result = await uploadFile(subFile);

      if (result) {
        const imageUrl =
          "https://connect-images1.s3.ap-northeast-2.amazonaws.com/" + result;

        updateSubReq(
          activeSubId,
          subName,
          imageUrl,
          activeOption?.id || activeCateId
        );
      }
    } else {
      updateSubReq(
        activeSubId,
        subName,
        null,
        activeOption?.id || activeCateId
      );
    }
  }, [
    subFile,
    updateSubReq,
    activeSubId,
    subName,
    activeOption?.id,
    activeCateId,
  ]);

  useEffect(() => {
    if (updateSubRes.data && updateSubRes.called) {
      alert("하위 카테고리가 수정되었습니다.");
      window.location.reload();
    }
  }, [updateSubRes]);

  const handleDeleteSub = useCallback(() => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("하위 카테고리를 삭제하시겠습니까?")) {
      deleteSubReq(activeSubId);
    }
  }, [activeSubId, deleteSubReq]);

  useEffect(() => {
    if (deleteSubRes.called && !deleteSubRes.error) {
      alert("삭제되었습니다.");
      window.location.reload();
    }
  }, [deleteSubRes]);

  return (
    <>
      <Wrapper>
        <Title>카테고리 관리</Title>
        <Container>
          <ToggleContainer>
            {categories.map((el) => {
              const items: IDropItem[] = [];

              el.subCategories.forEach((i) => {
                items.push({ id: i.id, name: i.name });
              });

              return (
                <Toggle
                  key={el.id}
                  title={el.name}
                  items={items}
                  parentsId={el.id}
                  handleCateClick={handleCateClick}
                  handleSubClick={handleSubClick}
                />
              );
            })}
          </ToggleContainer>
          <PostContainer>
            <PostColumnContainer>
              <PostTitle>카테고리</PostTitle>
              <AdminImage
                setImage={setCategoryImage}
                setImageFile={setCategoryFile}
                image={categoryImage}
              />
              <div style={{ height: "85px" }} />
              <TextField
                title="카테고리 이름"
                value={categoryName}
                onChange={setCategoryName}
                width={300}
              />
              {!cateModify && (
                <Btn onClick={handleCateSubmit}>카테고리 추가</Btn>
              )}
              {cateModify && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <ModiBtn
                    style={{ marginRight: "30px" }}
                    onClick={handleUpdateCate}
                  >
                    수정
                  </ModiBtn>
                  <ModiBtn onClick={handleDeleteCate}>삭제</ModiBtn>
                </div>
              )}
            </PostColumnContainer>
            <PostColumnContainer>
              <PostTitle>하위 카테고리</PostTitle>
              <AdminImage
                setImage={setSubImage}
                setImageFile={setSubFile}
                image={subImage}
              />
              <Dropdown
                options={options}
                active={activeOption}
                onSelected={(option) => {
                  setActiveOption(option);
                }}
                width={300}
                placeholder="상위 카테고리"
              />
              <TextField
                title="하위 카테고리 이름"
                value={subName}
                onChange={setSubName}
                width={300}
              />
              {!subModify && (
                <Btn onClick={handleSubSubmit}>하위 카테고리 추가</Btn>
              )}
              {subModify && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <ModiBtn
                    style={{ marginRight: "30px" }}
                    onClick={handleUpdateSub}
                  >
                    수정
                  </ModiBtn>
                  <ModiBtn onClick={handleDeleteSub}>삭제</ModiBtn>
                </div>
              )}
            </PostColumnContainer>
          </PostContainer>
        </Container>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 95%;
  background-color: white;
  height: calc(100vh - 160px);
  padding: 20px;
  scrollbar-width: none;
  overflow: scroll;
  border: 1px solid black;
  border-radius: 10px;
`;

const Title = styled.div`
  font-size: 25px;
  margin-bottom: 20px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const ToggleContainer = styled.div`
  height: 700px;
  border: 1px solid black;
  border-radius: 10px;
  width: 400px;
  overflow-y: scroll;
  scrollbar-width: none;
`;

const PostContainer = styled.div`
  height: 700px;
  border: 1px solid black;
  border-radius: 10px;
  width: 800px;
  display: flex;
  justify-content: center;
`;

const PostTitle = styled.div`
  font-size: 20px;
  margin-top: 50px;
`;

const Btn = styled.div`
  background-color: #007bff;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 173px;
  height: 46px;
  color: white;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;

const PostColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  align-items: center;
  height: 70%;
  margin: auto 0;
`;

const ModiBtn = styled.div`
  background-color: #007bff;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 133px;
  height: 46px;
  color: white;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }
`;
