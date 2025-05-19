import React, { useState } from 'react'
import AdditionBasicInfo from '../layout/AdditionBasicInfo';
import style from './Addition.module.css'
import arrowLeft from '../assets/arrow-left-contained-01.svg'
import arrowRight from '../assets/arrow-right-contained-01.svg'
import Button from '../components/Button';
import AdditionStep from '../layout/AdditionStep';
import RecipeDetailLayout from '../layout/RecipeDetailLayout'
import Input from '../components/Input';
import axios from 'axios';
import Comment from '../components/Comment';
import Timer from '../components/Timer';
import FloatingButton from '../components/FloatingButton';
import watchImg from '../assets/stopwatch-03.svg'
import css from './RecipeDetailPage.module.css'
import Nutritional from '../components/Nutritional';
import TTSComponent from '../components/TTSComponent';
import playImg from '../assets/play-03.svg'
import RecipeStepCard from '../components/RecipeStepCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Addition = () => {
    const {userId, nickname} = useSelector(state => state.user)
    const [title, setTitle] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [target, setTarget] = useState('');
    const [category, setCategory] = useState('');
    const [time, setTime] = useState(0);
    const [timeType, setTimeType] = useState('시간');
    const [level, setLevel] = useState('');
    const [calorie, setCalorie] = useState(0);
    const [ration, setRation] = useState(0);
    const [rationType, setRationType] = useState('g');
    const [ingredient, setIngredient] = useState([]);
    const [description, setDescription] = useState([{ description : '', image : '' }]);
    const [page, setPage] = useState(1)
    const [activeTab, setActiveTab] = useState(0)
    const [showTimer, setShowTimer] = useState(false)

    const navigate = useNavigate();

    const pageLeft = () => {
        setPage((prev) => prev - 1)
    }

    const pageRight = () => {
        setPage((prev) => prev + 1)
    }

    const uploadRecipes = async () => {
        try {
            const formData = new FormData()
            formData.append('userId', userId)
            formData.append('nickname', nickname)
            formData.append('title', title)
            const descriptionData = description.map((e) => (
                e.description
            ))
            formData.append('description', descriptionData)
            formData.append('targetPetType', target)
            formData.append('foodCategory', category)
            formData.append('cookingTimeLimit', time + timeType)
            formData.append('level', level)
            formData.append('caloriesPerServing', calorie)
            let carbs = 0, protein = 0, fat = 0, calcium = 0, phosphorus = 0, moisture = 0, fiber = 0, nacl = 0, ptss = 0
            const ingredientsName = [], ingredientsAmount = [], ingredientsUnit = []
            ingredient.map((e) => {
                carbs += e.crbQy || 0
                protein += e.protQy || 0
                fat += e.fatQy || 0
                calcium += e.clciQy || 0
                phosphorus += e.phphQy || 0
                moisture += e.mitrQy || 0
                fiber += e.totEdblfibrQy || 0
                nacl += e.naQy || 0
                ptss += e.ptssQy || 0
                ingredientsName.push(e.feedNm)
                ingredientsAmount.push(e.capacity)
                ingredientsUnit.push(e.capacityType)
            })
            formData.append('carbs', carbs) // 탄수화물
            formData.append('protein', protein) // 단백질
            formData.append('fat', fat) // 지방
            formData.append('calcium', calcium) // 칼슘
            formData.append('phosphorus', phosphorus) // 인
            formData.append('moisture', moisture) // 수분
            formData.append('fiber', fiber) // 식이섬유
            formData.append('nacl', nacl) // 나트륨
            formData.append('ptss', ptss) // 칼륨
            formData.append('ingredientsName', ingredientsName)
            formData.append('ingredientsAmount', ingredientsAmount)
            formData.append('ingredientsUnit', ingredientsUnit)

            if (mainImage) {
                formData.append('images', mainImage)
            }
            description.forEach((step, idx) => {
                formData.append('images', step.image)
            })

            await axios.post('https://seungwoo.i234.me:3333/AddRecipe', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            navigate('/')
        } catch (error) {
            alert(error)
        }
    }

    const BasicInfoList = () => {
        return (
            <div className={css.infoListWrap}>
                <ul style={{ marginTop: '12px' }}>
                    <li>추천 대상: {target|| '정보없음'}</li>
                    <li>
                        조리 시간: { time || '정보없음'} / 난이도:{' '}
                        {level || '정보없음'}
                    </li>
                    <li>
                        칼로리: {calorie || '정보없음'}kcal / 1회
                        급여량: {ration}
                        {rationType}
                    </li>
                </ul>
            </div>
        )
    }

    const IngredientList = () => {
        return (
            <>
                <span className={css.ingredentTitle}>🐾&nbsp;&nbsp;재료</span>
                <div className={css.infoListWrap}>
                    <ul style={{ marginTop: '12px' }}>
                        {ingredient.map((data, index) => (
                            <li key={index}>
                                {data.feedNm}&nbsp;{data.capacity}
                                {data.capacityType}{' '}
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        )
    }

    const BasicInfo = () =>{
        const recipeData = ingredient.reduce((acc, curr) => (
            {
                recipe : 
                {
                    NUTRITIONAL_INFO_CARBS_G: acc.recipe.NUTRITIONAL_INFO_CARBS_G + (curr.crbQy || 0), // 탄수화물
                    NUTRITIONAL_INFO_PROTEIN_G:  acc.recipe.NUTRITIONAL_INFO_PROTEIN_G  + (curr.protQy || 0), // 단백질
                    NUTRITIONAL_INFO_FAT_G:      acc.recipe.NUTRITIONAL_INFO_FAT_G      + (curr.fatQy || 0), // 지방
                    NUTRITIONAL_INFO_CALCIUM_G:    acc.recipe.NUTRITIONAL_INFO_CALCIUM_G    + (curr.clciQy || 0), // 칼슘
                    NUTRITIONAL_INFO_PHOSPHORUS_G: acc.recipe.NUTRITIONAL_INFO_PHOSPHORUS_G + (curr.phphQy || 0), // 인
                    NUTRITIONAL_INFO_MOISTURE_PERCENT:  acc.recipe.NUTRITIONAL_INFO_MOISTURE_PERCENT  + (curr.mitrQy || 0), // 수분
                    NUTRITIONAL_INFO_FIBER_G:      acc.recipe.NUTRITIONAL_INFO_FIBER_G      + (curr.totEdblfibrQy || 0), // 식이섬유
                    NUTRITIONAL_INFO_NACL_G:    acc.recipe.NUTRITIONAL_INFO_NACL_G    + (curr.naQy || 0), // 나트륨
                    NUTRITIONAL_INFO_PTSS_G:    acc.recipe.NUTRITIONAL_INFO_PTSS_G    + (curr.ptssQy || 0), // 칼륨
                }
            }
    ), { recipe : { NUTRITIONAL_INFO_CARBS_G: 0, NUTRITIONAL_INFO_PROTEIN_G: 0, NUTRITIONAL_INFO_FAT_G: 0, NUTRITIONAL_INFO_CALCIUM_G: 0,  NUTRITIONAL_INFO_PHOSPHORUS_G: 0, NUTRITIONAL_INFO_MOISTURE_PERCENT: 0, NUTRITIONAL_INFO_FIBER_G: 0, NUTRITIONAL_INFO_NACL_G: 0, NUTRITIONAL_INFO_PTSS_G: 0 }});
        return  (
            <>
                <BasicInfoList />
                <IngredientList />
                <Nutritional recipeData={recipeData} />
            </>
        )
    }

    const RecipeSteps = () => {

        // 전체 레시피 텍스트
        const allDescriptions = description.map((step) => step.description)

        return (
            <>
                {/* 내용 전체재생 */}
                <div className={css.ttsWrap}>
                    <TTSComponent text={allDescriptions} playBtnImg={playImg} />
                    <span className={css.btnTitle}>전체레시피 읽어주기</span>
                </div>

                {/* 레시피 단계별 카드 */}
                {description.map((step, index) => (
                    <RecipeStepCard
                        key={index}
                        number={index + 1}
                        instruction={step.description}
                        image={step.image ? URL.createObjectURL(step.image) : null}
                        btnkey={index}
                    />
                ))}
            </>
        )
    }

    // 타이머 플로팅 버튼 클릭 핸들러
    const handleTimerButtonClick = () => {
        setShowTimer((prev) => !prev)
    }

    // 플로팅 버튼 (타이머)
    const floatingButtonElement = (
        <>
            <FloatingButton iconSrc={watchImg} onClick={handleTimerButtonClick} />
            {showTimer && <Timer />}
        </>
    )

    // 로딩 상태의 텍스트 컴포넌트
    const loadingComponent = (
        <div className={css.loadingWrapper}>
            레시피 <span className={css.loadingDots}>불러오는 중</span>
        </div>
    )

    return (
        <div className={style.Addition}>
            <div className={style.header}>
                { page !== 3 ? (
                    <Input
                        type='text'
                        value={title}
                        placeholder='제목을 입력해주세요'
                        onChange={(e) => setTitle(e.target.value)}
                    />
                ) : null
                }
            </div>
            <div className={style.content}>
                {page === 1 ? (
                    <AdditionBasicInfo
                        mainImage={mainImage}
                        setMainImage={setMainImage}
                        target={target}
                        setTarget={setTarget}
                        category={category}
                        setCategory={setCategory}
                        time={time}
                        setTime={setTime}
                        timeType={timeType}
                        setTimeType={setTimeType}
                        level={level}
                        setLevel={setLevel}
                        calorie={calorie}
                        setCalorie={setCalorie}
                        ration={ration}
                        setRation={setRation}
                        rationType={rationType}
                        setRationType={setRationType}
                        ingredient={ingredient}
                        setIngredient={setIngredient}
                    />
                ) : page === 2 ? (
                    <AdditionStep
                        description={description}
                        setDescription={setDescription}
                    />
                ) : ( 
                    <RecipeDetailLayout
                        title={title}
                        headerContent={nickname}
                        mainImage={ mainImage ? URL.createObjectURL(mainImage) : null}
                        tabs={['기본 정보', '조리법']}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        tabContent={activeTab === 0 ? <BasicInfo /> : <RecipeSteps />}
                        footerContent={<></>}
                        floatingButton={floatingButtonElement}
                        isLoading={false}
                        error={null}
                        loadingComponent={loadingComponent}
                    />
                )}
            </div>
            <div className={style.navigation}>
                {
                    page === 1 ? <button style={{display : 'hidden'}}></button> : page === 3 ? '' :
                    <button onClick={pageLeft}>
                        <img src={arrowLeft} alt="Previous"/>
                    </button>
                }
                {
                    page === 3 ? "" :
                    <button onClick={pageRight}>
                        <img src={arrowRight} alt="Next"/>
                    </button>
                }
                {
                    page === 3 ? (
                        <>
                            <Button
                                text='이전'
                                color="sandBrown"
                                size='sm'
                                onClick={() => setPage(2)}
                            />
                            <Button
                                text="등록하기"
                                color="brown"
                                size='sm'
                                onClick={uploadRecipes}
                            />
                        </>
                    ) : null
                }
            </div>
            <menu />
        </div>
    )
}

export default Addition