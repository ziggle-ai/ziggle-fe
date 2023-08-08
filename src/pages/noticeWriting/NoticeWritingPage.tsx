import { useMutation } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { uploadImages } from "src/apis/image/image-api";
import { createNotice } from "src/apis/notice/notice-api";
import styled from "styled-components";

import Area from "../../atoms/containers/area/Area";
import Content from "../../atoms/containers/content/Content";
import Flex from "../../atoms/containers/flex/Flex";
import Icon from "../../atoms/icon/Icon";
import Checkbox from "../../atoms/inputs/checkbox/Checkbox";
import Input from "../../atoms/inputs/input/Input";
import Spacer from "../../atoms/spacer/Spacer";
import Text from "../../atoms/text/Text";
import NoticeTypeRadio from "../../molecules/noticeTypeRadio/NoticeTypeRadio";
import colorSet from "../../styles/colorSet";
import Font from "../../styles/font";
import { NoticeType, Tag } from "../../types/types";
import dateFormat from "../../utils/dateFormat";
import NoticeWritingActions from "./NoticeWritingActions";
import NoticeWritingImageInput from "./NoticeWritingImageInput";
import TagSelector from "./TagSelector";

const DateInput = styled.input`
  border: none;
  font-size: 1.125rem;
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 500;
  color: ${colorSet.primary};
  outline: none;

  ::-webkit-calendar-picker-indicator {
    // TODO: primary color로 바꾸기
  }
`;

const NoticeWritingPage = () => {
  const [title, setTitle] = useState<string>("");
  const [noticeType, setNoticeType] = useState<NoticeType>(NoticeType.RECRUIT);
  const [hasDeadline, setHasDeadline] = useState<boolean>(false);
  const [deadline, setDeadline] = useState<string>(dateFormat(new Date(), "-"));

  const [tags, setTags] = useState<Tag[]>([]);

  const [images, setImages] = useState<File[]>([]);

  const editorRef = useRef<any>(null);

  const handleNotice = useMutation(createNotice, {});
  const handleImage = useMutation(uploadImages, {
    onSuccess: (data) => {
      const content = editorRef.current.getContent();

      handleNotice.mutate({
        title,
        body: content,
        deadline: hasDeadline ? new Date(deadline) : undefined,
        tags: tags.map((tag) => tag.id),
        images: data,
      });
    },
  });

  const handleSubmit = () => {
    handleImage.mutate({
      images,
    });
  };

  return (
    <Area>
      <Content>
        <Spacer height={"100px"} />

        <Input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          placeholder={"제목을 입력하세요"}
          fontSize={"3rem"}
        />

        <Spacer height={"15px"} />

        <Flex alignItems={"center"} gap={"10px"}>
          <Checkbox
            label={"마감일 설정"}
            checked={hasDeadline}
            onChange={(event) => {
              setHasDeadline(event.target.checked);
            }}
          />

          {hasDeadline && deadline && (
            <DateInput
              type={"date"}
              value={deadline}
              onChange={(event) => {
                setDeadline(event.target.value);
              }}
            />
          )}
        </Flex>

        <Spacer height={"15px"} />

        <Flex flexDirection={"column"} gap={"15px"}>
          <Flex alignItems={"center"} gap={"12px"}>
            <Icon.LinesBlack width={"24px"} />
            <Text font={Font.Medium} size={"1.25rem"}>
              분류
            </Text>
          </Flex>

          <NoticeTypeRadio
            selected={noticeType}
            onChange={(noticeType: NoticeType) => setNoticeType(noticeType)}
          />
        </Flex>

        <Spacer height={"35px"} />

        <TagSelector tags={tags} setTags={setTags} />

        <Spacer height={"25px"} />

        <Flex flexDirection={"column"} gap={"15px"}>
          <Flex gap={"12px"}>
            <Icon.DocumentBlack width={"24px"} />
            <Text font={Font.Medium} size={"1.25rem"}>
              본문 내용 입력
            </Text>
          </Flex>

          <Editor
            tinymceScriptSrc={"../../../tinymce/tinymce.min.js"}
            onInit={(_, editor) => (editorRef.current = editor)}
            init={{
              promotion: false,
            }}
          />
        </Flex>

        <Spacer height={"60px"} />

        <NoticeWritingImageInput files={images} setFiles={setImages} />

        <Spacer height={"100px"} />

        <NoticeWritingActions handleSubmit={handleSubmit} />
      </Content>

      <Spacer height={"100px"} />
    </Area>
  );
};

export default NoticeWritingPage;